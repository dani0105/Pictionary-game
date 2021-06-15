import React, { Component } from 'react';
import { getStore } from "../../service";
import { connect } from "react-redux";
import { Alert, ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { lang } from '../../i18n/lang';

interface State {
    numMesa: number
}

class CreateRoom extends Component<any> {
    
    public state: State;

    constructor(props) {
        super(props);
        this.state = {
            numMesa: 0
        }
    }

    createRoom = () => {
        //Start the game
        this.props.navigation.push('GameRoom')
        Alert.alert("Final");
    } 

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ImageBackground  source={require('C:\\Users\\aliha\\ProyectoReactNative\\pictionary-frontend\\src\\view\\Fondo_Pictionary.png')}  style={styles.backgroundImage}>
                    <View style={{flexDirection: "row", alignItems: "center", padding: 10, paddingTop:330}}>
                        <Text style={styles.textStyle}>
                            {lang.numberRoom}
                        </Text>
                        <Text style={styles.textStyle}>
                            {lang.numberRoom} {//en esta parte va el numero de sala Daniel
                            }
                        </Text>
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center", padding: 10, paddingTop:20 }}>
                        <Text style={styles.textStyle}>
                            {lang.password}
                        </Text>
                        <TextInput style={styles.input} placeholder={lang.password_input} onChangeText={(value:string) => this.setState({password: value})}>
                        </TextInput>
                    </View>
                    <View> 
                        <Pressable
                            style={styles.button}
                            onPress={() => this.createRoom()}>
                            <Text style={styles.textStyle}>{lang.createRoom}</Text>
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
        fontWeight: "bold",
        color: "black",
        textAlign: "center",
        marginRight: 10,
    },
    input: {
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
export default connect(mapStateTOprops)(CreateRoom);