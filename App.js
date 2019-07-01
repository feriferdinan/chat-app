import React, { Component } from 'react';
import {YellowBox} from 'react-native';
import Routing from './src/pages/Routing/Routing';

export default class App extends Component{
  render(){
    YellowBox.ignoreWarnings(['Warning: Async Storage has been extracted from react-native core'],
    ["can't perform a react state update on an unmounted component. this is a no-op"]);
    return(
       <Routing/>
    );
  }
}

