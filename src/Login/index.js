import React, { Component } from 'react';

import {
StyleSheet,
Text,
View,
TextInput,
TouchableOpacity
} from 'react-native';
const axios = require('axios');
import { createStackNavigator, createAppContainer } from "react-navigation";


export default class index extends Component {
    constructor(){
        super()
        this.state={
            inputEmail:"",
            inputPassword:""
        }
    }

   goToHome = handleNavigation = () =>{
        this.props.navigation.navigate('Home')
    }
    handleLogin =  () => {
        axios.post(`http://${configs.ipaddress}:3000/auth/signin`,{
          "email" : this.state.inputEmail,
          "password" : this.state.inputPass
        })
        .then(res =>{
          const  data = res.data.data
          axios.post(`http://${configs.ipaddress}:3000/auth/create/authorization`,{
            "user_id" : data.id,
            "name" : data.name,
            "email" :data.email
          })
          .then (res => {
            console.log(res.data.data.token)
            console.log(data)
            if (data == null){
              alert("Tidak Dapat Menemukan Akun")
            }else{
              AsyncStorage.setItem('token', res.data.data.token);
               Navigation.push(this.props.componentId,{
                 component:{
                   name:"Home"
                 }
               })
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
            `Kelihatanya ${this.state.inputEmail} tidak cocok dengan akun yang ada. Jika Anda belum memiliki akun Facebook, Anda dapat membuatnya sekarang. `,
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
    <TextInput style={styles.inputBox}
        underlineColorAndroid='white'
        placeholder="Email"
        placeholderTextColor = "#ffffff"
        selectionColor="#fff"
        onChangeText={(text)=>this.setState({
            inputEmail:text
        })}
    />
    <TextInput style={styles.inputBox}
        underlineColorAndroid='white'
        placeholder="Password"
        secureTextEntry={true}
        placeholderTextColor = "#ffffff"
        onChangeText={(text)=>this.setState({
            inputPassword:text
        })}
    />
    <TouchableOpacity style={styles.button}
            onPress={this.handleNavigation}>
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
inputBox: {
    width:300,
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    color:'#ffffff',
    marginVertical: 10
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
