import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { getStore } from "../service";
import { connect } from "react-redux";
import ColorPalette from 'react-native-color-palette';

import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
//import { RNSketchCanvas } from '@terrylinla/react-native-sketch-canvas';

interface State {
    username: string,
    colors: string[]
    selectedColor: string
}

class GameRoom extends Component<any> {

    public state: State;
    public canvas: any;

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            colors: ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688"],
            selectedColor: "#F44336"
        }
    }

    dataCanvasSend = () => {
        this.props.Socket.emit("dataSend", {element:this.canvas._sketchCanvas._paths})

        this.props.Socket.on('dataResived', (data: any) => {
            console.log(data)
        });

    }
    
    render() {
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
    }
}
                    /*<RNSketchCanvas
                        style={{ flex: 1 }}
                        strokeColor={'red'}
                        strokeWidth={7}
                        ref = {ref => this.canvas = ref}
                        onPathsChange = {(path)=>{this.canvas.getPaths().forEach(element => {
                                this.dataCanvasSend()
                                console.log(element)
                        });console.log("hola")}}
                    />
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
                       saveComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Save</Text></View>}
                       savePreference={() => {
                        return {
                          folder: 'RNSketchCanvas',
                          filename: String(Math.ceil(Math.random() * 100000000)),
                          transparent: false,
                          imageType: 'png'
                        }
                       }}
                       onSketchSaved={(success, filePath) => { console.log('onSketchSaved', 'filePath: ' + filePath); }}
                    />*/
 

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
export default connect(mapStateTOprops)(GameRoom);