import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import Login from "./src/pages/Login/index"
import Home from "./src/pages/Home/index"
import Chat from "./src/pages/Chat/index"




const AppNavigator = createStackNavigator({
  
  Login: {
    screen: Login,
  },
  Home: {
    screen: Home,
  },
  Chat: {
    screen: Chat,
  },

},{
  headerMode: 'none',
  navigationOptions: {
  headerVisible: false,
},});

export default createAppContainer(AppNavigator);