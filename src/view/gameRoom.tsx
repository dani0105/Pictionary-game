import React, { Component } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { lang } from '../i18n/lang';
import { Socket } from 'socket.io-client';
import { CanvasComponent, ChatComponent } from '../component';
import { Path } from '@terrylinla/react-native-sketch-canvas';

interface props {
    idRoom: number
    onFinish: () => void,
    Socket: Socket,
    isJoin: boolean,
    Auth:any
}

interface State {
    isPlaying: boolean,
    word: number,
    wordToPaint: string | null,
    players: any[],
    currentRound: number,
    wordLength: number,
    totalRounds: number,
    timer: number,
    timeIntervale: any | null;
    messages: any[],
    isPreRound: boolean,
    currentWord: string
}

export class GameRoom extends Component<props> {

    public canvas: any;
    public state: State;

    constructor(props) {
        super(props);
        this.state = {
            word: 4,
            wordToPaint: null,
            isPlaying: false,
            players: [],
            currentRound: 0,
            wordLength: 0,
            isPreRound: false,
            totalRounds: 0,
            timer: 0,
            currentWord: "",
            messages: [],
            timeIntervale: null
        }

        this.props.Socket.on("preround", this.preRound);
        this.props.Socket.on("room:players", this.onPlayerUpdate);
        this.props.Socket.on("chat:receive", this.onChatReceive);
        this.props.Socket.on("round", this.onRound);
        this.props.Socket.on("room:got", this.onGotRoom);
        this.props.Socket.on("room:deleted", this.onFinish);
        this.props.Socket.on("word", this.onWord);
        this.stopwatch = this.stopwatch.bind(this);
        if (this.props.isJoin) {
            this.props.Socket.emit("room:get");
        }
    }

    // aqui llega toda la informacion del la sala
    onGotRoom = (data) => {
        this.setState({
            currentRound: data.currentRound,
            wordLength: data.wordLength,
            totalRounds: data.totalRounds,
            timer: data.timer,
            timeIntervale: setInterval(this.stopwatch, 1000),
            players: data.players
        });
    }

    /*
        Aqui llega la palabra que la persona va a dibujar 
    */
    onWord = (data) => {
        this.setState({
            wordToPaint: data
        })
    }

    /*
        Aqui llega la ronda que se esta jugando, la longitud de la palabra y la cnatidad total de rondas.
    */
    onRound = (data) => {
        clearInterval(this.state.timeIntervale)
        this.setState({
            currentRound: data.currentRound,
            wordLength: data.wordLength,
            totalRounds: data.totalRounds,
            timer: data.timer,
            timeIntervale: setInterval(this.stopwatch, 1000)
        });
    }

    /*
        Aqui llega la informacion de los jugadores, se llama cada vez que un usuario acierta o se une.
    */
    onPlayerUpdate = (data: any) => {
        var isPlaying = false;
        data.players.forEach(element => {
            if (element.id == this.props.Socket.id) {
                isPlaying = element.isDrawing;
            }
        })
        this.setState({
            players: data.players,
            isPlaying: isPlaying
        });
    }

    /*
        Aqui llega los mensajes del chat
    */
    onChatReceive = (data) => {
        var username;
        var message;
        console.log("mensajes",data)
        if (data.action) {
            username = data.message;
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
        } else {
            username = data.username
            message = data.message
        }

        this.setState({
            messages: [{
                username: username, message: message, id: data.id
            }].concat(this.state.messages)
        })
    }

    /*
        cuando termina la partida
    */
    onFinish = (data) => {
        console.log(data)
        this.props.Socket.off("preround", this.preRound);
        this.props.Socket.off("room:players", this.onPlayerUpdate);
        this.props.Socket.off("chat:receive", this.onChatReceive);
        this.props.Socket.off("round", this.onRound);
        this.props.Socket.off("room:got", this.onGotRoom);
        this.props.Socket.off("room:deleted", this.onFinish);
        this.props.Socket.off("word", this.onWord);
        this.props.onFinish();
    }

    stopwatch = () => {
        this.setState({ timer: this.state.timer - 1 });
        if (this.state.timer <= 0) {
            clearInterval(this.state.timeIntervale);
        }
    }

    sendMessage = (message: string) => {
        this.props.Socket.emit("chat:send", { username: this.props.Auth.data, message: message })
    }

    preRound = (data) => {
        console.log("pre round", data)
        this.setState({ isPlaying: false, isPreRound: true, currentWord: data.word })
        setTimeout(() => this.setState({ isPreRound: false }), data.preRound)
    }

    renderItem = ({ item }) => (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text>{item.username}: </Text>
            <Text>{item.points}: </Text>
        </View>
    );

    render() {
        return (
            <View>
                <Modal animationType="slide" transparent={true} visible={this.state.isPreRound}>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }}>
                        <View style={{backgroundColor:'white',borderRadius:10,}}>
                            <Text>
                                {this.state.currentWord}
                            </Text>
                            <Text>
                                Ranking
                            </Text>
                            <FlatList
                                style={{display:'flex',flexDirection:'column',height:'100%'}}
                                data={this.state.players}
                                renderItem={this.renderItem}
                                keyExtractor={item => item.id}
                            />
                        </View>

                    </View>
                </Modal>
                <View style={styles.header}>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Text style={{ fontWeight: "500" }}>{lang.roomId}: {this.props.idRoom}</Text>
                        <Text style={{ fontWeight: "500", marginLeft: 10 }}>
                            {lang.roomRound} {this.state.currentRound}/{this.state.totalRounds}
                        </Text>
                        <Text style={{ fontWeight: "500", marginLeft: 10 }}>
                            {lang.time} {this.state.timer}
                        </Text>
                    </View>
                    <View style={{ display: 'flex', alignItems: 'center' }}>
                        {this.state.isPlaying ? (
                            <Text style={{ fontSize: 18 }}>
                                {this.state.wordToPaint}
                            </Text>
                        ) : (
                            <Text style={{ fontSize: 18 }}>
                                {[...Array(this.state.wordLength)].map((element, index) => (
                                    <Text style={{ paddingLeft: 10 }} key={index}>
                                        _.
                                    </Text>))}
                            </Text>
                        )}

                    </View>
                </View>
                <View style={{ height: '60%' }}>
                    <CanvasComponent socket={this.props.Socket} isPlaying={this.state.isPlaying} />
                    {/* <CanvasPaint/> Aquí va el componente del canvas */}
                </View>
                <View style={{ height: '40%' }}>
                    <ChatComponent sendMessage={this.sendMessage} messages={this.state.messages} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#FFCC1C',
        padding: 5
    }
});
