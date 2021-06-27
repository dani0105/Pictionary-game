import React, { Component } from 'react';
import { getStore } from "../service";
import { connect } from "react-redux";
import { Alert, ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View, ToastAndroid } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { lang } from '../i18n/lang';
import { GameRoom } from './gameRoom';

interface State {
    username: string,
    roomCode: string,
    roomPassword: string,
    showAlert: boolean,
    roomId:number
}

class JoinRoom extends Component<any> {
    
    public state: State;

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            roomCode: "",
            roomPassword: "",
            roomId:-1,
            showAlert: false
        }
    }


    joinRoom = () => {
        //Start the game
        //Send request to the socket
        this.props.Socket.emit("room:connect", {
            id:this.state.roomCode,
            password:this.state.roomPassword
        })
        //Listen response from the socket
        this.props.Socket.on("room:connected", (data: any) => {
            console.log(data)
            if (data.success){
                this.setState({roomId:this.state.roomCode})
            }else{
                this.setState({showAlert:true})
            }
        })
    }


    showToast = () =>{
        //this.setState({roomCode: ""});
        ToastAndroid.showWithGravityAndOffset(
            lang.roomNumberNull,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            50
        );
        this.setState({roomCode:""});
    }

    onFinishGame = () => {

    }


    render() {
        if (this.state.roomId >= 0) {
            return (<GameRoom isJoin={true} Socket={this.props.Socket} idRoom={this.state.roomId} onFinish={this.onFinishGame}/>)
        }

        if(this.state.showAlert)
            return(
                <SafeAreaView style={styles.container}>
                    <ImageBackground source={require('../assets/Fondo_Pictionary.png')}  style={styles.backgroundImage}>
                        <AwesomeAlert
                            show={this.state.showAlert}
                            showProgress={false}
                            title={lang.joinRoomErr}
                            message={lang.joinRoomErrMsg}
                            closeOnTouchOutside={false}
                            closeOnHardwareBackPress={false}
                            showCancelButton={false}
                            showConfirmButton={true}
                            cancelText=""
                            confirmText="Ok"
                            confirmButtonColor="#5DBB63"
                            onCancelPressed={() => {
                                this.setState({showAlert:false});
                            }}
                            onConfirmPressed={() => {
                                this.setState({showAlert:false});
                            }}
                            titleStyle={{textAlign: "center", fontFamily:"FredokaOne-Regular"}}
                            messageStyle={{textAlign: "center", fontFamily:"FredokaOne-Regular"}}
                            confirmButtonTextStyle={{padding:8,  fontFamily:"FredokaOne-Regular"}}
                        />                        
                    </ImageBackground>
                </SafeAreaView>
            );
        else
            return (
                <SafeAreaView style={styles.container}>
                    <ImageBackground  source={require('../assets/Fondo_Pictionary.png')}  style={styles.backgroundImage}>
                        <View style={{flexDirection: "row", alignItems: "center", padding: 10, paddingTop:330 }}>
                            <Text style={styles.textStyle}>
                                {lang.roomNumber}
                            </Text>
                            <TextInput style={styles.input} placeholder={lang.numberRoom_input} placeholderTextColor="#FFFFFF" 
                            keyboardType="numeric" onChangeText={(value:string) => this.setState({roomCode: value})}>
                            </TextInput>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", padding: 10, paddingTop:20 }}>
                            <Text style={styles.textStyle}>
                                {lang.password}
                            </Text>
                            <TextInput style={styles.input} placeholder={lang.password_input_c} placeholderTextColor="#FFFFFF" 
                            onChangeText={(value:string) => this.setState({roomPassword: value})}>
                            </TextInput>
                        </View>
                        <View> 
                            <Pressable
                                style={styles.button}
                                onPress={() => this.state.roomCode == "" ? this.showToast() : this.joinRoom()}>
                                <Text style={styles.textStyle}>{lang.joinRoom}</Text>
                            </Pressable>
                        </View>
                    </ImageBackground>                    
                </SafeAreaView>
            );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        marginTop: 30,
        marginLeft: 75,
        marginRight: 75,
        backgroundColor: "#2196F3",
    },
    textStyle: {
        fontSize: 18,
        fontFamily:"FredokaOne-Regular",
        color: "black",
        textAlign: "center",
        marginRight: 10
    },
    input: {
        height: 50,
        width: 200,
        margin: 5,
        fontFamily:"FredokaOne-Regular",
        fontSize: 14
    },
    backgroundImage:{
        flex : 1,
        width: '100%',
        height: '100%'
    }
});

const mapStateTOprops = (state: any) => {
    return getStore(state);
}
export default connect(mapStateTOprops)(JoinRoom);