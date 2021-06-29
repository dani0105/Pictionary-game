const Client = require("socket.io-client");
const config = require("../config/config");

module.exports = class BotUtil {


    constructor() {
        this.socket = new Client(`http://localhost:${config.server.port}`);
        this.socket.on("connect", this.onConnected)
        this.username = "Bot Alfred"
        this.testingCreate = false;
        this.lastDraw = [];
        this.interval = null;
        this.isPlaying = false;
    }

    onConnected = (data) => {
        this.printLog(`Conectado!`);
        this.socket.on("room:players", this.onPlayerUpdate);
        this.socket.on("chat:receive", this.onChatReceive);
        this.socket.on("room:deleted", this.onFinish);
        this.socket.on("preround", this.preRound);
        this.socket.on("round", this.onRound);
        this.socket.on("word", this.onWord);
        this.socket.on("draw:upated", this.onDraw);

        if(this.testingCreate){
            this.createGameRoom();
        }
    }

    joinGameRoom = (id,password) => {
        if(!this.testingCreate){
            this.printLog(`Conectado a la sala id ${id}`);
            //this.socket.emit("room:connect",{id:id,name:this.username,password:password})
        }
    }

    onDraw = (data) => {
        if(!this.isPlaying)
            this.lastDraw.push(data.data)
    }

    preRound = (data) => {
        clearInterval(this.interval);
        this.isPlaying = false;
        this.printLog(` Apunto de iniciar otra Ronda!`)
    }

    /*
        Aqui llega la palabra que la persona va a dibujar 
    */
    onWord = (data) => {
        this.printLog(` Tengo que dibujar  ${data}`);
        this.index = 0;
        this.isPlaying = true;
        this.interval = setInterval(this.draw,1000);
    }

    draw = () => {
        if(this.index == this.lastDraw.length){
            this.socket.emit("draw:update",{raction:3,data:null})
            this.index =0
        }
        this.printLog("Estoy dibujando")
        this.socket.emit("draw:update",{action:1,data:this.lastDraw[this.index]})
        this.index ++;
    }

    /*
        Aqui llega la ronda que se esta jugando, la longitud de la palabra y la cnatidad total de rondas.
    */
    onRound = (data) => {
        this.printLog(`nueva ronda`);
    }

    /*
        Aqui llega la informacion de los jugadores, se llama cada vez que un usuario acierta o se une.
    */
    onPlayerUpdate = (data) => {
        //console.log(data)
    }

    /*
        Aqui llega los mensajes del chat
    */
    onChatReceive = (data) => {
        if (data.action) {
            var message = "";
            switch (data.action) {
                case 1:
                    message = "se conecto"
                    break;
                case 2:
                    message = "se desconecto"
                    break;
                case 3:
                    message = "está dibujando"
                    break;
                case 4:
                    message = "respuesta correcta"
                    break;
            }
            console.log(data.message,message)
        } else {
            console.log(data.username,data.message)
        }
    }

    /*
        cuando termina la partida
    */
    onFinish = (data) => {
        this.printLog(`Fin de la partida gg`);
        
    }


    createGameRoom = () => {
        const room = {
            lang: "es_es",
            password: '',
            public: true,
            owner: this.username,
            round: 3,
            time: 30, // segundos
            randomWords: true,
            maxPlayer: 4
        }
        this.printLog(`creando sala`);
        this.socket.emit("room:create", room);
        this.socket.on("room:created", this.onRoomConected)
    }

    onRoomConected = (data) => {
        if (data.success) {
            this.printLog(`Sala creada con id ${data.roomId}`);
        }
    }

    // para tener prints de logs más bonitos <3
    printLog = (message) => {
        console.log(`${this.username}: ${message}`)
    }




}