import React, { Component } from 'react';
import { getStore } from "../service";
import { connect } from "react-redux";
import { Alert, ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { lang } from '../i18n/lang';

interface State {
    username: string
}

class DashBoard extends Component<any> {

    public state: State;

    constructor(props) {
        super(props);
        this.state = {
            username: ""
        }
    }

    createRoom = () => {
        //Start the game
        this.props.navigation.push('CreateRoom')
    } 

    joinRoom = () => {
        //Start the game
        this.props.navigation.push('JoinRoom')
    } 

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ImageBackground  source={require('../assets/Fondo_Pictionary.png')}  style={styles.backgroundImage}>
                    <View style={{paddingTop: 370}}>
                        <Pressable
                            style={styles.button}
                            onPress={() => this.createRoom()}>
                            <Text style={{fontSize: 18, fontFamily:"FredokaOne-Regular", color: "white", 
                            textAlign: "center", marginRight: 10}}>
                                {lang.createRoom}
                            </Text>
                        </Pressable>
                    </View>
                    <View style={{paddingTop:20}}> 
                        <Pressable
                            style={styles.button}
                            onPress={() => this.joinRoom()}>
                            <Text style={{fontSize: 18, fontFamily:"FredokaOne-Regular", color: "white", 
                            textAlign: "center", marginRight: 10}}>
                                {lang.joinRoom}
                            </Text>
                        </Pressable>
                    </View>
                    <View style={{paddingTop:20}}> 
                        <Pressable
                            style={styles.button}
                            onPress={() => this.props.navigation.pop()}>
                            <Text style={{fontSize: 18, fontFamily:"FredokaOne-Regular", color: "white", 
                            textAlign: "center", marginRight: 10}}>
                                {lang.goBack}
                            </Text>
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
        textAlign: "center"
    },
    input: {
        fontFamily:"FredokaOne-Regular",
        height: 40,
        margin: 5
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
export default connect(mapStateTOprops)(DashBoard);