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

interface props {
    messages: any[],
    sendMessage: (message: string) => void
}

interface State {
    message: string,
    id: number
}
export class ChatComponent extends Component<props> {

    public state: State;

    constructor(props) {
        super(props);
        this.state = {
            message: "",
            id: 0
        };
    }

    renderItem = ({ item }) => (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily:"FredokaOne-Regular", padding:2.5, paddingLeft:15 }}>{item.username}: </Text>
            <Text style={{ fontFamily:"Montserrat-Medium", padding:2.5 }}>{item.message}</Text>
        </View>
    );

    render() {
        return (
            <SafeAreaView  style={{flex:1}}>
                <View style={{flex:1}}>
                    <FlatList
                        style={{display:'flex',flexDirection:'column',height:'100%'}}
                        data={this.props.messages}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id}
                        ListHeaderComponent={<TextInput

                            onChangeText={(value) => {
                                this.setState({ message: value });
                            }}
                            value={this.state.message}
                            placeholder={lang.writeMessage}
                            onSubmitEditing={() => {
                                this.props.sendMessage(this.state.message)
                                this.setState({ message: "" })
                            }}
                            placeholderTextColor="black"
                            style={{paddingLeft:15}}
                        />}
                    />
                </View>

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({

});

