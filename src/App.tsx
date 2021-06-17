import * as React from 'react';
import { lang } from './i18n/lang';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreateRoom, DashBoard, GameRoom, JoinRoom, Login } from './view/index'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Alert,
} from 'react-native';
import { addSocket, addUser, store } from './service';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import config from './envConfig';
import { io } from "socket.io-client";

const generalStack = createStackNavigator();
export class App extends React.Component<any> {

    public state:any;

    constructor(props) {
        super(props);
        this.state = {
            connecting:true
        }
    }

    componentDidMount(){
        store.dispatch(addUser( {username:"Prueba"} ) );
        store.dispatch(addSocket( io(config.ApiUrl) ) );
        store.subscribe(() => {
            this.setState({ connecting: false });
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Provider store={store}>
                    <NavigationContainer>
                        <generalStack.Navigator screenOptions={{ headerShown: false }}>
                            <generalStack.Screen name="Login" component={Login}/>
                            <generalStack.Screen name="CreateRoom" component={CreateRoom}/>
                            <generalStack.Screen name="JoinRoom" component={JoinRoom}/>
                            <generalStack.Screen name="DashBoard" component={DashBoard}/>
                            <generalStack.Screen name="GameRoom" component={GameRoom}/>
                        </generalStack.Navigator>
                    </NavigationContainer>
                </Provider>
            </SafeAreaView>);
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    }
});