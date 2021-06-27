import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { getStore } from "../service";
import { connect } from "react-redux";

import RNSketchCanvas, { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import { Socket } from 'socket.io-client';

interface props{
    pintor:boolean,
    Socket: Socket
}

interface State {
    username: string
}

class CanvasPaint extends Component<props> {

    public state: State;
    public canvas: any;
    public canvasReceived: any;

    constructor(props) {
        super(props);
        this.state = {
            username: ""
        }
        this.props.Socket.on("draw:upated", this.dataCanvasRecived); 
    }

    dataCanvasSend = () => {
        this.props.Socket.emit("draw:update", {element:this.canvas._sketchCanvas._paths});
    }

    dataCanvasRecived = (data) => {
        this.canvasReceived.addPath(data);
    }
    
    render() {
        if(this.props.pintor){
            return (
                <View style={styles.container}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <RNSketchCanvas
                            containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
                            canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
                            defaultStrokeIndex={0}
                            defaultStrokeWidth={5}
                            undoComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Undo</Text></View>}
                            clearComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Clear</Text></View>}
                            eraseComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Eraser</Text></View>}
                            strokeComponent={color => (
                                <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
                            )}
                            strokeSelectedComponent={(color) => {
                                console.log(color)
                                return (
                                    <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
                                )
                            }}
                            strokeWidthComponent={(w) => {
                                console.log(w)
                                return (<View style={styles.strokeWidthButton}>
                                    <View style={{
                                        backgroundColor: 'white', marginHorizontal: 2.5,
                                        width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2}} />
                                </View>
                                )
                            }}
                            ref = {ref => this.canvas = ref}
                            onPathsChange = {()=>{this.canvas._sketchCanvas._paths.forEach(element => {
                                    this.dataCanvasSend()
                                    console.log(element)
                            });console.log("hola")}}
                        />    
                    </View>
                </View>
            );
        }else{
            return (
                <View style={styles.container}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <SketchCanvas
                            touchEnabled = {false}
                            style={{ flex: 1 }}
                            ref = {ref => this.canvasReceived = ref}
                        />
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF',
    },
    strokeColorButton: {
        marginHorizontal: 2.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15,
    },
    strokeWidthButton: {
        marginHorizontal: 2.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15,
        justifyContent: 'center', alignItems: 'center', backgroundColor: '#39579A'
    },
    functionButton: {
        marginHorizontal: 2.5, marginVertical: 8, height: 30, width: 60,
        backgroundColor: '#39579A', justifyContent: 'center', alignItems: 'center', borderRadius: 5,
    }
});

const mapStateTOprops = (state: any) => {
    return getStore(state);
}
export default connect(mapStateTOprops)(CanvasPaint);