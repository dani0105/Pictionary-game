const { PayloadTooLarge } = require('http-errors');
const wordController = require('./word.controller');

module.exports = class RoomController{

    constructor(io,id,roomOwner,lang,password,isPublic,round,time,randomWords,maxPlayer,deleter){
        this.id = id;
        this.io = io;
        this.roomOwner = roomOwner;
        this.lang = lang;
        this.password = password;
        this.public = password?false:true;
        this.round = round;
        this.currentRound = 1;
        this.time = time;
        this.timer = null;
        this.randomWords = randomWords;
        this.maxPlayer = maxPlayer;
        this.players = [];
        this.words = [];
        this.isPlaying = false;
        this.currentPlayer = 0;
        this.currentWord = 0;
        this.answers = 0;
        this.deleter = deleter;
        this.messageCount = 0;
        console.log("La sala",this.id," es ",this.public?"Publica":"Privada")
    }

    /**
     * se llama cuando el jugador en turno dibuja
     * @param {Object} data objeto con la informacion del dibujo  
     */
    onDrawing = (data) => {
        this.io.to(this.id).emit("draw:upated",data) // reenvio el dibujo a todos
    }

    nextRound = () => { // esta funcion se ejecuta al terminar el turno del jugador
        this.players[this.currentPlayer].isDrawing = false;
        this.players[this.currentPlayer].socket.off("draw:update",this.onDrawing) // dejo de escuhar su dibujo
        this.currentPlayer++;
        
        if(this.currentPlayer >= this.players.length){
            this.currentPlayer = 0;
            this.currentRound++;
            if(this.currentRound > this.round){// ya se jugaron todas las rondas ?
                // terminar la sala 
                this.finishRoom();
                return
            }
        }
        this.io.to(this.id).emit("preround",{word:this.words[this.currentWord].word,preRound:5000});
        this.currentWord ++;
        setTimeout(this.preRound,6000); // tiempo muerto de 5 segundo entre rondas para mostrar los puntos
    }

    finishRoom(){
        this.updatePlayers();
        this.players[this.currentPlayer].socket.off("draw:update",this.onDrawing)
        // elmina los listeners del lado del servidor
        this.players.forEach(element => {
            element.socket.off("chat:send",this.readChat)
            element.socket.emit("room:deleted",{word:this.words[this.currentWord].word})
        })
        this.deleter(this.id);
    }

    async startRoom  ()  {
        if(this.randomWords){
            this.words = await wordController.get_word({lang:this.lang,size:this.maxPlayer * this.round});
            this.words = this.words.data;
            this.preRound()
        }else{
            
        }
        this.isPlaying = true;
    }

    
    preRound = () => {
        console.log("Pre ronda")
        this.answers = 0;
        this.players[this.currentPlayer].isDrawing = true;
        this.players[this.currentPlayer].socket.on("draw:update",this.onDrawing)
        this.players[this.currentPlayer].socket.emit("word",this.words[this.currentWord].word)// envio la palabra al jugadro en turno
        this.io.to(this.id).emit("round",{currentRound:this.currentRound,wordLength:this.words[this.currentWord].word.length,totalRounds:this.round,timer:this.time})
        this.timer = setTimeout(this.nextRound,this.time*1000);
        this.updatePlayers(this.players[this.currentPlayer].name,3);
    }


    /**
     *  se encarga de actualziar la informacion de los jugadores 
     * @param {string} player jugador que realizo la accion
     * @param {number} action accion que se realizo 1:se conecto 2: desconeccion 3:dibujando 4: respuesta correcta  
     */
    updatePlayers(player= null,action = null){
        console.log("Actualizando informacion de jugadores",player," ",action)
        var list = [] // lista de los jugadores 
        this.players.forEach(element => {
            list.push({
                id:element.socket.id,
                name:element.name,
                points:element.points,
                isDrawing:element.isDrawing
            });
        })

        this.players.forEach(element => {
            element.socket.emit("room:players",{
                players:list
            })
        });

        //envio el mensaje del jugador a los demas
        if(player){
            if(action == 3){
                this.io.to(this.id).emit("draw:upated",{action:3,data:null}) // envia una señal para lipiar el canvas
            }
            this.messageCount++;

            this.io.to(this.id).emit("chat:receive",{
                message:player,
                action:action,
                id:this.messageCount.toString()
            });

        }
    }

    async addPlayer(socketPlayer,playerName){
        console.log(playerName,": se está conectando",this.players.length,this.maxPlayer)

        if(this.players.length == this.maxPlayer){
            return false;
        }
        let player = {
            socket: socketPlayer,
            id:socketPlayer.id,
            name:playerName,
            points:0,
            isDrawing:false
        }
        this.players.push(player);
        player.socket.join(this.id);
        player.socket.on("chat:send",data => this.readChat(data,player.id)); // leo el chat   del jugador
        player.socket.on("room:get",data => this.getRoomInfo(data,player.socket));
        this.updatePlayers(player.name,1);// se manda la informacion de todos los jugadores a todos los participantes
        if(this.players.length >=  (this.maxPlayer >>> 1) && !this.isPlaying){ // cuando esta la mitad de los jugadores se comienza la partida
            await this.startRoom();
        }
        return true;
    }

    getRoomInfo = (data,socket) => {
        var list = [] // lista de los jugadores 
        console.log("Solicitando datos de partida ")
        this.players.forEach(element => {
            list.push({
                id:element.socket.id,
                name:element.name,
                points:element.points,
                isDrawing:element.isDrawing
            });
        })
        if(this.isPlaying)
            socket.emit("room:got",{
                currentRound:this.currentRound,
                wordLength:this.words[this.currentWord].word.length,totalRounds:this.round,timer:this.time,
                players:list
            });
    }

    readChat = (data,id) => {
        console.log(data)
        this.messageCount++;
        if(this.isPlaying){
            if(this.words[this.currentWord].word.toLowerCase().trim() == data.message.toLowerCase().trim() ){
                for (let i = 0; i < this.players.length; i++) {
                    const element = this.players[i];
                    if(element.id == id){
                        element.points += 100;
                        break;
                    }
                }
                this.players[this.currentPlayer].points += 20; // le sumo puntos por que alguien adivino

                this.answers++;
                
                this.updatePlayers(data.username,4)
                if(this.answers == this.players.length-1){
                    // se termina la ronda;
                    clearTimeout(this.timer); // evito que se ejecute la funcion de siguiente turno

                    this.nextRound(); // ejecuto la funcion de siguiente turno
                    this.answers = 0
                }
                return;
            }
        }
        data.id = this.messageCount.toString();
        this.io.to(this.id).emit("chat:receive",data)
    }
}