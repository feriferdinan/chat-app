import React from "react";
import { View, Text } from "react-native";
import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import Login from "./src/pages/Login/index"
import Home from "./src/pages/Home/index"
import Chat from "./src/pages/Chat/index"
import Splash from "./src/pages/Splash/Splash"


const AppStack = createStackNavigator({ Chat: Chat, Home: Home },{
  headerMode: 'none',
  navigationOptions: {
  headerVisible: false,
},});
const AuthStack = createStackNavigator({ Login: Login },{
  headerMode: 'none',
  navigationOptions: {
  headerVisible: false,
},});
const AuthLoadingScreen = createStackNavigator({Splash:Splash },{
  headerMode: 'none',
  navigationOptions: {
  headerVisible: false,
},});

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));