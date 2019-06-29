import React from 'react';
import {View, ImageBackground, StyleSheet, FlatList,AsyncStorage,BackHandler,TextInput ,Button,TouchableHighlight} from 'react-native';
import { ListItem,Icon } from 'react-native-elements';
import Message from '../../Components/Message';

const axios = require('axios');
import configs from '../../../config'
import {StackNavigator} from 'react-navigation';

export default class index extends React.Component {

    constructor(){
        super()
        this.state={
            messages:[],
            text:"",
            submittedText:'',
        }
        setInterval(
            this._getData
        ,2000)
    }

    handleLogout = () =>{
        AsyncStorage.clear();
        this.props.navigation.navigate('Login')
    }

    _getData = async () => {
        that = this
        const valueToken= await AsyncStorage.getItem('token')
        this.setState({
          token:valueToken
        })
        if(valueToken == null ){
          await this.props.navigation.navigate('Login')
          }else{
            BackHandler.removeEventListener('hardwareBackPress');
         }
         let config = {
          headers: {
            'Authorization': 'jwt ' + valueToken
          }
        }
        axios.get(`http://${configs.ipaddress}:3000/chat`,config)
        .then(function (response) {
          console.log(response.data.data)
          that.setState({
            messages:response.data.data
          })
        })
        
        .catch(function (error) {
          console.log(error);
        });
    }
  

    async componentDidMount(){
        that = this
        const valueToken= await AsyncStorage.getItem('token')
        this.setState({
          token:valueToken
        })
        if(valueToken == null ){
          await this.props.navigation.navigate('Login')
          }else{
            BackHandler.removeEventListener('hardwareBackPress');
         }
         let config = {
          headers: {
            'Authorization': 'jwt ' + valueToken
          }
        }
        axios.get(`http://${configs.ipaddress}:3000/chat`,config)
        .then(function (response) {
          console.log(response.data.data)
          that.setState({
            messages:response.data.data
          })
        })
        
        .catch(function (error) {
          console.log(error);
        });
       }

    submitText = ()=>{
        this.setState({
            text:""
        })
        let config = {
            headers: {
              'Authorization': 'jwt ' + this.state.token
            }
          }
          axios.post(`http://${configs.ipaddress}:3000/chat`,{
            text: this.state.text
          },config)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }  

    render() {
        return (
            <ImageBackground
				style={[ styles.container, styles.backgroundImage ]}
				source={require('../../assets/img/background.png')}>
                <ListItem 
                    containerStyle={{backgroundColor:"#fff"}}
                    title="Public Group Chat"
                    leftElement={
                    <TouchableHighlight onPress={this.handleLogout} >             
                        <Icon name="arrowleft" type="antdesign" color="grey" size={20} />
                    </TouchableHighlight>
                    }
        
                    titleStyle={{color:"grey"}}
                />
				<FlatList
					style={styles.container}
					data={this.state.messages}
					renderItem={Message}
					keyExtractor={(item, index) => (`message-${index}`)}
				/>
                
				<View style={styles.compose}>
				<TextInput
					style={styles.composeText}
					value={this.state.text}
					onChangeText={(text) => this.setState({text:text})}
					editable = {true}
					maxLength = {40}
                    placeholder="Ketik Pesan"
				/>
				<Button
					onPress={this.submitText}
					title="Kirim"
				/>
			</View>
			</ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    listItem: {
        width: '70%',
        margin: 10,
        padding: 10,
        backgroundColor: 'white',
        borderColor: '#979797',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 10
    },
    incomingMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#E1FFC7'
    },
    composeText: {
        width: '80%',
        paddingHorizontal: 10,
        height: 40,
        backgroundColor: 'white',
        borderColor: '#979797',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 20,
      },
      compose: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 10,
        borderRadius: 20,
      }
})