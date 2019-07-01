import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

import Login from "../Login/index"
import Home from "../Home/index"
import Chat from "../Chat/index"
import Loading from "../Loading/Loading"



const AppStack = createStackNavigator({ 
  Chat: Chat,
  Home: Home 
},{
  headerMode: 'none',
  navigationOptions: {
  headerVisible: false,
},});
const AuthStack = createStackNavigator({ Login: Login },{
  headerMode: 'none',
  navigationOptions: {
  headerVisible: false,
},});
const AuthLoadingScreen = createStackNavigator({Loading:Loading },{
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