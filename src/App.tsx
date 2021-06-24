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
import { addUser, store } from './service';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import { addSocket } from './service/store.service';
import config from './envConfig.js';

import { NavigationContainer } from '@react-navigation/native';

const generalStack = createStackNavigator();
export class App extends React.Component<any> {


    constructor(props) {
        super(props);
    }

    componentDidMount() {
        store.dispatch(addSocket( io(config.ApiUrl) ) );
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