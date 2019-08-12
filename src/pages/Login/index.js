import React, { Component } from 'react';
import {
StyleSheet,
Text,
View,
TextInput,
TouchableOpacity,
AsyncStorage,
Alert,
StatusBar,
Dimensions 
} from 'react-native';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

import Icon from 'react-native-vector-icons/MaterialIcons';

import { Spinner } from 'native-base';
const axios = require('axios');
import configs from '../../../config'

import AnimateLoadingButton from 'react-native-animate-loading-button';
let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


export default class index extends Component {
    constructor(){
        super()
      
                      
        this.state={
            inputEmail:"",
            inputPassword:"",
            icEye: 'visibility-off',
            showPassword: true,
            isLoading:true
        }
       
      
    }
    changePwdType = () => {
      let newState;
      if (this.state.showPassword) {
          newState = {
              icEye: 'visibility',
              showPassword: false,
              password: this.state.inputPassword
          }
      } else {
          newState = {
              icEye: 'visibility-off',
              showPassword: true,
              password: this.state.inputPassword
          }
      }
      this.setState(newState)
  };
  handlePassword = (password) => {
      let newState = {
          icEye: this.state.icEye,
          showPassword: this.state.showPassword,
          password: password
      }
      this.setState(newState);
      this.props.callback(password)
  };

  
    handleLogin =  () => {
      if(this.state.inputEmail=="" || this.state.inputPassword=="") {
        alert("Lengkapi Form Terlebih dahulu")  
      }else{ 
        this.loadingButton.showLoading(true);
        axios.post(`http://${configs.ipaddress}:3333/api/auth/login`,{
          "email" : this.state.inputEmail,
          "password" : this.state.inputPassword
        })
          .then (res => {
            console.log(res.data.token)
            AsyncStorage.setItem('token', res.data.token);
            if (res.data.token == null){
              alert("Tidak Dapat Menemukan Akun")
            }else{
              this.loadingButton.showLoading(false);
              this.props.navigation.navigate('Home')
            }
          })
        .catch(err =>{
          console.log('erordi auth sign in:',err)
          this.loadingButton.showLoading(false);
          Alert.alert(
            'Tidak Dapat Menemukan Akun',
            `Kelihatanya ${this.state.inputEmail} tidak cocok dengan akun yang ada. Jika Anda belum memiliki akun Chat, Anda dapat membuatnya sekarang. `,
            [
              {
                text: 'BUAT AKUN',
                onPress: () => this.props.navigation.navigate('Register'),
                style: "default",
              },
              {text: 'COBA LAGI',  onPress:this.handleLogin},
            ],
           
          );
        })}
    }


render(){
  console.log(screenWidth)
  return(
  <View style={styles.container}>
<StatusBar  barStyle='dark-content' backgroundColor="#fff" translucent = {true} />
  <View style={styles.wrapperForm} >
    <Text style={styles.title}>CHAT YUK</Text>
    <View style={styles.inputBox} >
    <TextInput 
        value={this.state.inputEmail}
        autoCompleteType='email'
        keyboardType="email-address"
        placeholder="Masukan Email Anda"
        placeholderTextColor = "grey"
        returnKeyType = {"next"}
        autoFocus = {true}
        onSubmitEditing={() =>  this.secondTextInput.focus()}
        onChangeText={(text)=>this.setState({
            inputEmail:text
        })}
    />
    <Icon 
        style={{position:"absolute",left:12,top:15}}
        name="email"
        size={16}
        color="rgba(0,0,0,0.5)"
    />
    </View>
    {
      (reg.test(this.state.inputEmail) == 1 || this.state.inputEmail=="") ? null :
    <Text style={{color:'red'}}>Email tidak valid</Text>
    }
    <View style={[styles.wrapperInputPassword, styles.inputBox]} >
    <TextInput
        value={this.state.inputPassword}
        placeholder="Masukan Password Anda"
        secureTextEntry={this.state.showPassword}
        ref={(input) => { this.secondTextInput = input; }}
        returnKeyType = {"go"}
        placeholderTextColor = "grey"
        onChangeText={(text)=>this.setState({
            inputPassword:text
        })}
    />
    <Icon 
        style={{position:"absolute",left:12,top:15}}
        name="lock"
        size={16}
        color="rgba(0,0,0,0.5)"
    />
    <Icon 
        style={styles.icon}
        name={this.state.icEye}
        size={25}
        color={componentColors.password_icon_color}
        onPress={this.changePwdType}
    />
    </View>
    <View style={{marginVertical:10}}>
      <AnimateLoadingButton
            ref={c => (this.loadingButton = c)}
            width={screenWidth - screenWidth*13/100}
            height={50}
            borderRadius={25}
            title="MASUK"
            titleFontSize={16}
            titleColor="#fff"
            backgroundColor= { (reg.test(this.state.inputEmail) == 0)? "rgba(81,125,162,0.6)" : "rgba(81,125,162,1)" }
            onPress={ (reg.test(this.state.inputEmail) == 0)? null : this.handleLogin}
          />
    </View>

</View>
  <View style={{justifyContent:'center',alignItems: 'center',position:"absolute",bottom:20}}>
      <Text>Belum Mempunyai Akun ?</Text>
    <TouchableOpacity>
      <Text 
        onPress={()=>this.props.navigation.navigate('Register')}
        style={{color:"#517da2",fontWeight:"bold"}} >DAFTAR SEKARANG!</Text>
    </TouchableOpacity>
</View>
</View>

)}
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
  margin:10,
 
},
inputBox: {
    width:screenWidth - screenWidth*13/100,
    borderRadius: 25,
    paddingHorizontal:16,
    paddingLeft:30,
    fontSize:16,
    color:'grey',
    marginVertical: 10,
    backgroundColor:"#ffff",
    borderColor: "#1c313a",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
},
wrapperForm:{
  width:"100%",
  backgroundColor:'rgba(86,130,163,0)',
  flexDirection:"column",
  alignItems:"center",
  borderRadius:20,
  padding:10,
  
},
wrapperInputPassword:{
  flexDirection:"row",
},
icon: {
  position: 'absolute',
  top: 11,
  right: 15
},
button: {
    width:"90%",
    backgroundColor:'#517da2',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
},
buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
}

});

export const componentColors = {
  password_icon_color:'#aeaeae',
};
