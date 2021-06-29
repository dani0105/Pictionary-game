require('dotenv').config();

const express   = require('express');
var app         = express();
var server      = require('http').Server(app);
const helmet    = require("helmet");
const logger    = require('morgan');
const src       = require('./src');
const io        = require('socket.io')(server, {
    cors:true,
    origins:'*:*'
});
const controller = require("./src/index").Controller;

//Configuracion del servidor
app.set('port', src.Config.server.port);

app.use(helmet());
app.use(logger('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "x-requested-with, content-type,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// Definicio de las rutas
app.use(express.static(__dirname + '/public'));

app.use('/word',src.Route.WordRoute);

io.on("connection",(socket)=> {
    controller.SocketController.connected(io, socket) 
});

// Inicio del servidor
server.listen(app.get('port'), function () {
    console.log(`server running in http://localhost:${app.get('port')}`);
});

module.exports = app;
