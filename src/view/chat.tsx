import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { getStore } from "../service";
import { connect } from "react-redux";
import { GiftedChat } from 'react-native-gifted-chat';
import { Header } from 'react-native-elements';

interface State {
    username: string,
    messages: []
}

class ChatText extends Component<any, any> {

    public state: State;

    constructor(props) {
        super(props);
        this.state = {
            username: this.props.Auth.data,
            messages: []
        };
    }

    onSend(messages = []) {
        console.log(this.props.Auth.data);
        console.log(this.state.username);
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }));
    }

    UNSAFE_componentWillMount() {
        this.setState({
          messages: [
            {
              _id: 1,
              text: 'Hola, ¿en qué puedo ayudarte?',
              createdAt: new Date(),
              user: {
                _id: 2,
                name: "React Native"
              },
            },
            {
                _id: 2,
                text: 'ESOOOO DANIEL',
                createdAt: new Date(),
                user: {
                  _id: 3,
                  name: "LEANDRO VASQUEZ"
                },
              },
          ],
        });
      }


    render() {
        return (
            <View style={styles.container}>
               <Header
                    backgroundColor="#233978"
                    centerComponent={{ text: 'Chat', style: { color: '#fff' } }}
                />

                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 1,
                        name: this.state.username
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

const mapStateTOprops = (state: any) => {
    return getStore(state);
}
export default connect(mapStateTOprops)(ChatText);