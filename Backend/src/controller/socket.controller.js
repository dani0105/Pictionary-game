const RoomController = require("./room.controller");
const BotUtil = require("../util").BotUtil;

const bot = new BotUtil();
let rooms = {};
let count = 1;

// conexion de un nuevo cliente 
exports.connected = (io,clientSocket) => {
    clientSocket.on("room:create", data => this.createRoom(io,clientSocket,data))
    clientSocket.on("room:connect", data => this.connectRoom(clientSocket,data))
    clientSocket.on("disconnect", () => this.disconnect(clientSocket))
    this.printLog(`User id ${clientSocket.id} ${clientSocket.handshake.address} connected`)
}

exports.deleter = (id) => {
    delete rooms[id];
}

// el usuario está creando una sala nueva para jugar con personas  
exports.createRoom = (io,clientSocket,data) => {
    let room = new RoomController(io,count,clientSocket,data.lang,data.password,data.public,data.round,data.time,data.randomWords,data.maxPlayer,this.deleter);
    rooms[count] = room;
    count ++;
    room.addPlayer(clientSocket,data.owner);
    bot.joinGameRoom(room.id,data.password);
    clientSocket.emit("room:created",{success:true,roomId:room.id})
}

//un usuario se esta conectado a una sala 
exports.connectRoom = async (clientSocket,data) => {
    let room = rooms[data.id]
    if(room){ // existe la sala?
        if(!room.public){ // partida privada
            if(data.password != room.password){
                clientSocket.emit("room:connected",{success:false})
                return
            }
        }
        let result = await room.addPlayer(clientSocket,data.name)
        clientSocket.emit("room:connected",{success:result})
    }else{
        clientSocket.emit("room:connected",{success:false})
    }
}

// el usuario se desconecto del servidor
exports.disconnect = (clientSocket) => {
    this.printLog(`User id ${clientSocket.id} disconected`)
}

// para tener prints de logs más bonitos <3
exports.printLog = (message) => {
    let date = new Date();
    console.log(`${date.getHours()}:${date.getMinutes()}.${date.getSeconds()}: ${message}`)
}

module.exports