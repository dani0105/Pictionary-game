import React, { Component } from 'react';
import { getStore } from "../service";
import { connect } from "react-redux";
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { lang } from '../i18n/lang';
import NumericInput from 'react-native-numeric-input';
import { Picker } from '@react-native-picker/picker';

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

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ImageBackground source={require('../assets/Fondo_Pictionary.png')} style={styles.backgroundImage}>
                    <View style={styles.formContainer}>
                        {this.state.roomId >= 0 ? (
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontSize: 18, fontWeight: '600' }}>
                                    {lang.roomId}: {this.state.roomId}
                                </Text>

                                <Text style={{ fontSize: 16, marginTop: 10, textAlign: 'center', fontWeight: '600' }}>
                                    {lang.waiting}
                                </Text>
                            </View>
                        ) : (
                            <View>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ height: '100%' }}>
                                        <Text>{lang.roomLang}</Text>
                                    </View>
                                    <View>
                                        <Picker
                                            onValueChange={(itemValue, itemIndex) => this.setState({ lang: itemValue })}
                                            style={{ minWidth: 150 }}
                                            selectedValue={this.state.lang}>
                                            <Picker.Item label="Español" value="es_es" />
                                            <Picker.Item label="Ingles" value="en_en" />
                                        </Picker>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ height: '100%' }}>
                                        <Text>{lang.roomMaxPlayers}</Text>
                                    </View>
                                    <View>
                                        <Picker
                                            onValueChange={(itemValue, itemIndex) => this.setState({ maxPlayer: itemValue })}
                                            style={{ minWidth: 150 }}
                                            selectedValue={this.state.maxPlayer.toString()}>
                                            <Picker.Item label="4 Jugadores" value="4" />
                                            <Picker.Item label="8 Jugadores" value="8" />
                                        </Picker>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ height: '100%' }}>
                                        <Text>{lang.roomRound}</Text>
                                    </View>
                                    <View>
                                        <NumericInput minValue={2} value={this.state.round} maxValue={8} onChange={value => this.setState({ round: value })} />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ height: '100%' }}>
                                        <Text>{lang.roomTime}</Text>
                                    </View>
                                    <View>
                                        <Picker
                                            onValueChange={(itemValue, itemIndex) => this.setState({ time: itemValue })}
                                            style={{ minWidth: 150 }}
                                            selectedValue={this.state.time.toString()}>
                                            <Picker.Item label="30 Segundos" value="30" />
                                            <Picker.Item label="1 Minuto" value="60" />
                                            <Picker.Item label="1:30 Minuto" value="90" />
                                        </Picker>
                                    </View>
                                </View>
                                <View>
                                    <TouchableOpacity
                                        style={{
                                            alignItems: 'center', backgroundColor: '#DDDDDD',
                                            padding: 10
                                        }}
                                        onPress={this.createRoom}
                                    >
                                        <Text>{lang.createRoom}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>)}

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
        backgroundColor: '#FFFFFF',
        height: '50%',
        width: '85%',
        borderRadius: 5,
        padding: 10
    }
});

const mapStateTOprops = (state: any) => {
    return getStore(state);
}
export default connect(mapStateTOprops)(CreateRoom);