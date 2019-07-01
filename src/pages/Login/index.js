import React, { Component } from 'react';
import {
StyleSheet,
Text,
View,
TextInput,
TouchableOpacity,
AsyncStorage,
Alert,
} from 'react-native';

const axios = require('axios');
import configs from '../../../config'


export default class index extends Component {
    constructor(){
        super()
      
                      
        this.state={
            inputEmail:"",
            inputPassword:""
        }
       
      
    }

  
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
    <Text style={styles.title}>CHAT YUK</Text>
    <TextInput style={styles.inputBox}
        placeholder="Masukan Email Anda"
        placeholderTextColor = "grey"
        returnKeyType = {"next"}
        onSubmitEditing={() => { this.secondTextInput.focus(); }}
        autoFocus = {true}
        onChangeText={(text)=>this.setState({
            inputEmail:text
        })}
    />
    <TextInput style={styles.inputBox}
        placeholder="Masukan Password Anda"
        secureTextEntry={true}
        ref={(input) => { this.secondTextInput = input; }}
        returnKeyType = {"go"}
        autoFocus = {true}
        placeholderTextColor = "grey"
        onChangeText={(text)=>this.setState({
            inputPassword:text
        })}
    />
    <TouchableOpacity style={styles.button}
            onPress={this.handleLogin}>
        <Text style={styles.buttonText}>MASUK</Text>
    </TouchableOpacity>
</View>
)
}
}

const styles = StyleSheet.create({
container : {
    backgroundColor: "#fff",
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
    width:"90%",
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    color:'grey',
    marginVertical: 10,
    backgroundColor:"#ffff",
    borderWidth:1
},

button: {
    width:"90%",
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
