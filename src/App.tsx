import * as React from 'react';
import { lang } from './i18n/lang';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export class App extends React.Component {


  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }



  render() {
    return (
      <SafeAreaView>
        <View>
          <Text style={{color:'black'}}>Reat Native Shell</Text>
        </View>
      </SafeAreaView>
    );
  }
}
