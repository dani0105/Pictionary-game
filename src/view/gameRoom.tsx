import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { getStore } from "../service";
import { connect } from "react-redux";
import { lang } from '../i18n/lang';
import { Socket } from 'socket.io-client';
import { TOUCHABLE_STATE } from 'react-native-gesture-handler/lib/typescript/components/touchables/GenericTouchable';
import CanvasPaint from './canvas';
import { ChatComponent } from '../component';

interface props {
    idRoom: number
    onFinish: () => void,
    Socket: Socket,
    isJoin:boolean
}

interface State {
    isPlaying: boolean,
    word: number,
    wordToPaint: string | null,
    players:any[],
    currentRound:number,
    wordLength:number,
    totalRounds:number,
    timer:number,
    timeIntervale:any|null;
    messages:any[]
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
            players:[],
            currentRound:0,
            wordLength:0,
            totalRounds:0,
            timer:0,
            messages:[],
            timeIntervale:null
        }

        this.props.Socket.on("preround", this.preRound);
        this.props.Socket.on("room:players", this.onPlayerUpdate);
        this.props.Socket.on("chat:receive", this.onChatReceive);
        this.props.Socket.on("round", this.onRound);
        this.props.Socket.on("room:got", this.onGotRoom);
        this.props.Socket.on("room:deleted", this.onFinish);
        this.props.Socket.on("word", this.onWord);
        this.stopwatch = this.stopwatch.bind(this);
        if(this.props.isJoin){
            this.props.Socket.emit("room:get");
        }
    }

    // aqu´llega toda la informacion del la sal
    onGotRoom = (data)=> {
        this.setState({
            currentRound:data.currentRound,
            wordLength:data.wordLength,
            totalRounds:data.totalRounds,
            timer:data.timer,
            timeIntervale:setInterval(this.stopwatch,1000),
            players:data.players
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
            currentRound:data.currentRound,
            wordLength:data.wordLength,
            totalRounds:data.totalRounds,
            timer:data.timer,
            timeIntervale:setInterval(this.stopwatch,1000)
        });
    }

    /*
        Aqui llega la informacion de los jugadores, se llama cada vez que un usuario acierta o se une.
    */
    onPlayerUpdate = (data:any) => {
        var isPlaying = false;
        data.players.forEach(element => {
            if(element.id == this.props.Socket.id){
                isPlaying = element.isDrawing;
            }
        })
        this.setState({
            players:data.players,
            isPlaying:isPlaying
        });
    }

    /*
        Aqui llega los mensajes del chat
    */
    onChatReceive = (data) => {
        var username;
        var message;
        if(data.action){
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
        }else{
            username = data.username
            message = data.message
        }

        this.setState({
            messages: [{
                username:username,message:message,id:data.id
            }] .concat(this.state.messages)
        })
    }

    /*
        cuando termina la partida
    */
    onFinish = (data) => {
        console.log(data)
        this.props.onFinish();
    }

    stopwatch = () => {
        this.setState({timer:this.state.timer-1});
        if(this.state.timer <= 0){
            clearInterval(this.state.timeIntervale);
        }
    }

    sendMessage = (message:string) => {
        this.props.Socket.emit("chat:send",{username:"prueba",message:message})
    }

    preRound = (data) => {
        // aqui se mostraría los resultados de la ronda que se jugo
    }

    render() {
        return (
            <View>
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
                <View style={{height:'60%'}}>
                    <CanvasPaint pintor={this.state.isPlaying} Socket={this.props.Socket} />
                    {/* <CanvasPaint/> Aquí va el componente del canvas */}
                </View>
                <View style={{height:'40%'}}>
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
