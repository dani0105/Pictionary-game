require('dotenv').config();
const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const controller = require("../src/index").Controller;

describe("Testing socket controller", () => {
    let io,alreadyConnectedPlayer1, serverSocketPlayer1,clientSocketPlayer1,serverSocketPlayer2,clientSocketPlayer2;

    let roomCreated;

    beforeAll((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
            const port = httpServer.address().port;
            io.on("connection", socket => {
                controller.SocketController.connected(io,socket)
                if(alreadyConnectedPlayer1){
                    serverSocketPlayer2 = socket;
                }else{
                    alreadyConnectedPlayer1 = true;
                    serverSocketPlayer1 = socket;
                }
            } );

            clientSocketPlayer1 = new Client(`http://localhost:${port}`);
            clientSocketPlayer1.on("connect", done);

            clientSocketPlayer2 = new Client(`http://localhost:${port}`);
            clientSocketPlayer2.on("connect", done);

        });
    });

    afterAll(() => {
        io.close();
        clientSocketPlayer1.close();
        clientSocketPlayer2.close();
    });

    test("Player 1 create room", (done) => {
        const room = {
            lang:"en_en",
            password:'',
            public:true,
            owner:'Player1',
            round:1,
            time:2, // segundos
            randomWords:true,
            maxPlayer:4
        }
        // esta sala va estar viva por 4 segundos

        clientSocketPlayer1.emit("room:create",room);
        clientSocketPlayer1.on("room:created",response => {
            roomCreated = response.roomId;
            expect(response.success).toBeTruthy()
            done()
        })
    });

    test("Player 2 join room", (done) => {

        clientSocketPlayer2.on("room:connected",response => {
            expect(response.success).toBeTruthy();
            done()
        })

        clientSocketPlayer2.emit("room:connect",{
            id:roomCreated,
            name:"player2"
        });
    });

    test("Player 2 send message", (done) => {
        const meesage = "arbol";
        clientSocketPlayer2.emit("chat:send",{message:meesage,username:"player2"})
        
        clientSocketPlayer2.on("chat:receive",response => {
            if(response.action)
                expect(response.action).toBe(4);
            else
                expect(response.message == meesage).toBeTruthy();
                clientSocketPlayer2.removeListener("chat:receive")
            done()
        })
    });
    
});