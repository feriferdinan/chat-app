/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import Login from './src/pages/Login/index';
import Chat from './src/pages/Chat/index';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
