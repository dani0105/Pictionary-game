import React, { Component } from 'react';
import { lang } from '../i18n/lang';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { getStore } from "../service";
import { connect } from "react-redux";

interface props{
    message:any
}

interface State {
    username: string,
    message: string,
    messages: Array<any>
}
  class ChatText extends Component<any, any> {

    public state: State;

    constructor(props) {
        super(props);
        this.state = {
            username: this.props.Auth.data,
            message: "",
            messages: []
        };
    }

    onSendLocal = () => {
        console.log(this.state.message);
        console.log(this.state.username);
        var messages = {username:this.state.username, msg:this.state.message};
        this.props.Socket.emit("chat:send", messages);
        this.setState({message:""})
    }
    
    renderItem = ({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{this.state.username}</Text>
          <Text style={styles.title}>{item.title}</Text>
        </View>
    );
    
    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.container}>
                    <View style={styles.container}>
                        <FlatList
                            data={this.state.messages}
                            renderItem={this.renderItem}
                        />
                    </View>
                    <View style={styles.container}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(value) => {
                                this.setState({message:value});
                            }}
                            value={this.state.message}
                            placeholder={lang.writeMessage}
                            onSubmitEditing={this.onSendLocal}
                        />
                    </View>
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
    }
});

const mapStateTOprops = (state: any) => {
    return getStore(state);
}
export default connect(mapStateTOprops)(ChatText);