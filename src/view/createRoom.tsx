import React, { Component } from 'react';
import { getStore } from "../service";
import { connect } from "react-redux";
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { lang } from '../i18n/lang';
import NumericInput from 'react-native-numeric-input';
import { Picker } from '@react-native-picker/picker';
import { GameRoom } from '.';
import { ScreenHeight } from 'react-native-elements/dist/helpers';

interface State {

    lang: string,
    password: string,
    public: boolean,
    round: number,
    time: number, // en segundos
    randomWord: boolean,
    maxPlayer: number,
    roomId: number
}

class CreateRoom extends Component<any> {

    public state: State;

    constructor(props) {
        super(props);
        this.state = {

            lang: 'es_es',
            password: '',
            maxPlayer: 4,
            public: true,
            randomWord: true,
            round: 3,
            time: 60,
            roomId: -1
        }
    }

    componentDidMount() {
        // escuhca conexiones a la sala
        this.props.Socket.on("room:created", this.createdRoom)
    }

    createdRoom = (data) => {
        if (data.success) {
            this.setState({ roomId: data.roomId })
        }
    }

    createRoom = () => {
        this.props.Socket.emit("room:create", {
            lang: this.state.lang,
            password: this.state.password,
            public: this.state.public,
            owner: this.props.Auth.username,
            round: this.state.round,
            time: this.state.time,
            randomWords: this.state.randomWord,
            maxPlayer: this.state.maxPlayer
        })
    }

    onFinishGame = () => {

    }

    render() {

        if (this.state.roomId >= 0) {
            return (<GameRoom isJoin={false} Socket={this.props.Socket} idRoom={this.state.roomId} onFinish={this.onFinishGame}/>)
        } else
            return (
                <SafeAreaView style={styles.container}>
                    <ImageBackground source={require('../assets/Fondo_Pictionary_2.png')} style={styles.backgroundImage}>
                        <View style={styles.formContainer}>
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ height: '100%', width: 110 }}>
                                        <Text style={{fontFamily:"FredokaOne-Regular", paddingTop:15, fontSize:18}}>{lang.roomLang}</Text>
                                    </View>
                                    <View>
                                        <Picker
                                            onValueChange={(itemValue, itemIndex) => this.setState({ lang: itemValue })}
                                            style={{ minWidth: 160 }}
                                            selectedValue={this.state.lang}>
                                            <Picker.Item label="Español" value="es_es" />
                                            <Picker.Item label="Ingles" value="en_en" />
                                        </Picker>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ height: '100%', width: 110 }}>
                                        <Text style={{fontFamily:"FredokaOne-Regular", paddingTop:15, fontSize:18}}>{lang.roomMaxPlayers}</Text>
                                    </View>
                                    <View>
                                        <Picker
                                            onValueChange={(itemValue, itemIndex) => this.setState({ maxPlayer: itemValue })}
                                            style={{ minWidth: 160 }}
                                            selectedValue={this.state.maxPlayer.toString()} >
                                            <Picker.Item label="4 Jugadores" value="4" style={{fontFamily:'FredokaOne-Regular'}} />
                                            <Picker.Item label="8 Jugadores" value="8" />
                                        </Picker>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ height: '100%', width: 115 }}>
                                        <Text style={{fontFamily:"FredokaOne-Regular", paddingTop:15, fontSize:18}}>{lang.roomRound}</Text>
                                    </View>
                                    <View>
                                        <NumericInput minValue={2} value={this.state.round} maxValue={8} onChange={value => this.setState({ round: value })} />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ height: '100%', width: 110 }}>
                                        <Text style={{fontFamily:"FredokaOne-Regular", paddingTop:15, fontSize:17}}>{lang.roomTime}</Text>
                                    </View>
                                    <View>
                                        <Picker
                                            onValueChange={(itemValue, itemIndex) => this.setState({ time: itemValue })}
                                            style={{ minWidth: 160 }}
                                            selectedValue={this.state.time.toString()}>
                                            <Picker.Item label="30 Segundos" value="30" />
                                            <Picker.Item label="1 Minuto" value="60" />
                                            <Picker.Item label="1:30 Minuto" value="90" />
                                        </Picker>
                                    </View>
                                </View>
                                <View style={{ paddingTop:35 }}>
                                    <TouchableOpacity
                                        style={{
                                            alignItems: 'center', backgroundColor: "#2196F3",
                                            padding: 10, borderRadius:30
                                        }}
                                        onPress={this.createRoom}
                                    >
                                        <Text style={{fontFamily:"FredokaOne-Regular", fontSize:18 }}>{lang.createRoom}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    </ImageBackground>
                </SafeAreaView>
            );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'yellow'
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        flexDirection: 'column',

        alignItems: 'center'
    },
    formContainer: {
        height: '30%',
        width: '70%',
        borderRadius: 5,
        padding: 10
    }
});

const mapStateTOprops = (state: any) => {
    return getStore(state);
}
export default connect(mapStateTOprops)(CreateRoom);