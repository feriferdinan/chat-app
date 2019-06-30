import React, { Component } from 'react';

import {
StyleSheet,
Text,
View,
TextInput,
TouchableOpacity,
AsyncStorage,
Alert
} from 'react-native';
const axios = require('axios');
import { createStackNavigator, createAppContainer } from "react-navigation";
import configs from '../../../config'


export default class index extends Component {
    constructor(){
        super()
      
                      
        this.state={
            inputEmail:"",
            inputPassword:""
        }
      
    }

   async componentWillMount(){
      var value = await AsyncStorage.getItem('token')
      (value !== null) ?
      this.props.navigation.navigate('Chat')
                    :
      this.props.navigation.navigate('Login')
    }

  
  //  handleNavigation = () =>{
  //       this.props.navigation.navigate('Home')
  //   }
    handleLogin =  () => {
      that=this
        axios.post(`http://${configs.ipaddress}:3000/auth/signin`,{
          "email" : this.state.inputEmail,
          "password" : this.state.inputPassword
        })
        .then(res =>{
          const  data = res.data.data
          axios.post(`http://${configs.ipaddress}:3000/auth/create/authorization`,{
            "user_id" : data.id,
            "email" :data.email
          })
          .then (res => {
           AsyncStorage.setItem('token', res.data.data.token);
            console.log(res.data.data.token)
            console.log("id ",data.id)
            if (data == null){
              alert("Tidak Dapat Menemukan Akun")
            }else{
              this.props.navigation.navigate('Chat')
            }
          })
          .catch(err => {
            alert("Tidak Dapat Menemukan Akun ")
            console.log("auth create",err)
          })
        })
        .catch(err =>{
          Alert.alert(
            'Tidak Dapat Menemukan Akun',
            `Kelihatanya ${this.state.inputEmail} tidak cocok dengan akun yang ada. Jika Anda belum memiliki akun Chat, Anda dapat membuatnya sekarang. `,
            [
              {
                text: 'BUAT AKUN',
                onPress: () => console.log(' Pressed'),
                style: "default",
              },
              {text: 'COBA LAGI',  onPress:this.handleLogin},
            ],
           
          );
          console.log('erordi auth sign in:',err)
        })
    }


render(){

return(

<View style={styles.container}>
    <Text style={styles.title}>PUBLIC GROUP CHAT</Text>
    <TextInput style={styles.inputBox}
        placeholder="Email"
        placeholderTextColor = "#ffffff"
        selectionColor="#fff"
        onChangeText={(text)=>this.setState({
            inputEmail:text
        })}
    />
    <TextInput style={styles.inputBox}
        placeholder="Password"
        secureTextEntry={true}
        placeholderTextColor = "#ffffff"
        onChangeText={(text)=>this.setState({
            inputPassword:text
        })}
    />
    <TouchableOpacity style={styles.button}
            onPress={this.handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
</View>
)
}
}

const styles = StyleSheet.create({
container : {
    backgroundColor: "grey",
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center'
},
title:{
  fontSize:20,
  fontWeight:"700",
  color:"#1c313a",
  margin:10
},
inputBox: {
    width:300,
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    color:'#ffff',
    marginVertical: 10,
    backgroundColor:"#aeaeaeae"
},

button: {
    width:300,
    backgroundColor:'#1c313a',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
},
buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
}



});