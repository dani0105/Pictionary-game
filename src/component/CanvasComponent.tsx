import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { getStore } from "../service";
import { connect } from "react-redux";

import RNSketchCanvas, { Path, SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import { Socket } from 'socket.io-client';

interface props {
    isPlaying: boolean,
    socket: Socket
}

export class CanvasComponent extends Component<props> {

    public canvas: any;
    public canvasReceived: any;

    constructor(props) {
        super(props);
        this.props.socket.on("draw:upated", this.onDrawing);
    }

    sendPath = (action: number, path: Path | Path[] | null) => {
        if(action == 1){
            if(!path)
                return;
        }
        
        this.props.socket.emit("draw:update", { action: action, data: path })
        if (action == 2) { // un paos atras
            this.canvas.undo()
        }
        if (action == 3) { // borrar todo
            this.canvas.clear()
        }
    
    }

    /*
        Aquí llega cuando un jugador está dibujando
    */
    onDrawing = (data) => {
        
        if (!this.props.isPlaying) {
            if (data.action == 1) { //nuevo trazo
                if(data.data)
                    this.canvasReceived.addPath(data.data)
            }
            if (data.action == 2) { // un paos atras
                this.canvasReceived.undo()
            }
            if (data.action == 3) { // borrar todo
                this.canvasReceived.clear()
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    {this.props.isPlaying ? (
                        <RNSketchCanvas
                            containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
                            canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
                            defaultStrokeIndex={0}
                            defaultStrokeWidth={5}
                            undoComponent={
                                <TouchableOpacity style={styles.functionButton} onPress={() => this.sendPath(2, [])}>
                                    <Text style={{ color: 'white' }}>
                                        Undo
                                    </Text>
                                </TouchableOpacity>
                            }
                            clearComponent={
                                <TouchableOpacity onPress={() => this.sendPath(3, [])} style={styles.functionButton}>
                                    <Text style={{ color: 'white' }}>
                                        Clear
                                    </Text>
                                </TouchableOpacity>
                            }
                            strokeComponent={color => (
                                <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
                            )}
                            strokeSelectedComponent={(color) => {
                                return (
                                    <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
                                )
                            }}
                            strokeWidthComponent={(w) => {
                                return (<View style={styles.strokeWidthButton}>
                                    <View style={{
                                        backgroundColor: 'white', marginHorizontal: 2.5,
                                        width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2
                                    }} />
                                </View>
                                )
                            }}
                            ref={ref => this.canvas = ref}
                            onPathsChange={() => {

                                if (this.canvas._sketchCanvas._paths[this.canvas._sketchCanvas._paths.length - 1])
                                    this.sendPath(1, this.canvas._sketchCanvas._paths[this.canvas._sketchCanvas._paths.length - 1])
                            }}
                        />
                    ) : (<SketchCanvas
                        touchEnabled={false}
                        style={{ flex: 1 }}
                        ref={ref => this.canvasReceived = ref}
                    />)}

                </View>
            </View>
        );
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
