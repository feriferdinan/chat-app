import { createSwitchNavigator, createStackNavigator, createAppContainer ,createMaterialTopTabNavigator} from 'react-navigation';

import LoadingScreen from "../Loading/Loading"
import LoginScreen from "../Login/index"
import HomeScreen from "../Home/index"
import ChatScreen from "../Chat/index"



const AppStack = createStackNavigator({ 
  Home: HomeScreen, 
  Chat: ChatScreen
},{
  headerMode: 'none',
  navigationOptions: {
  headerVisible: false,
},});
const AuthStack = createStackNavigator({ Login: LoginScreen },{
  headerMode: 'none',
  navigationOptions: {
  headerVisible: false,
},});
const AuthLoadingScreen = createStackNavigator({Loading:LoadingScreen },{
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