import React, { Component } from 'react';
import { lang } from '../../i18n/lang';
import { Alert, StyleSheet, Text, SafeAreaView, View, TextInput, ImageBackground, Pressable} from "react-native";
import { addUser } from "../../service";
import { connect } from "react-redux";

interface State {
    username: string
}

class Login extends Component<any> {

    public state: State;

    constructor(props) {
        super(props);
        this.state = {
            username: ""
        }
    }

    startGame = () => {
        //Start the game
        const user_data = {
            data: this.state.username
        }
        this.props.addUser(user_data)
        this.props.navigation.push('DashBoard')
        Alert.alert(user_data.data);
    } 

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ImageBackground  source={require('C:\\Users\\aliha\\ProyectoReactNative\\pictionary-frontend\\src\\view\\Fondo_Pictionary.png')}  style={styles.backgroundImage}>
                    <View style={{flexDirection: "row", alignItems: "center", padding: 10, paddingTop:370 }}>
                        <Text style={styles.textStyle}>
                            {lang.username_label}
                        </Text>
                        <TextInput style={styles.input} placeholder={lang.username_input} onChangeText={(value:string) => this.setState({username: value})}>
                        </TextInput>
                    </View>
                    <View style={{paddingTop:20}}> 
                        <Pressable
                            style={styles.button}
                            onPress={() => this.startGame()}>
                            <Text style={styles.textStyle}>{lang.play_button}</Text>
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
        textAlign: "center"
    },
    input: {
        height: 40,
        margin: 10
    },
    backgroundImage:{
        flex : 1,
        width: '100%',
        height: '100%'
    }
});

export default connect(null, { addUser })(Login);