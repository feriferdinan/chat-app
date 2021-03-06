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

import Icon from 'react-native-vector-icons/MaterialIcons';
import { Spinner } from 'native-base';
const axios = require('axios');
import configs from '../../../config'
import IconFA from 'react-native-vector-icons/FontAwesome';
let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export default class index extends Component {
    constructor(){
        super()
      
                      
        this.state={
            inputUsername:"",
            inputEmail:"",
            inputPassword:"",
            icEye: 'visibility-off',
            showPassword: true,
            isLoading:false
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

  
    handleRegister =  () => {
      if(this.state.inputUsername=="" || this.state.inputEmail=="" || this.state.inputPassword=="") {
        alert("Lengkapi Form Terlebih dahulu")  
      }else{ 
        this.setState({isLoading:true})
        axios.post(`http://${configs.ipaddress}:3333/api/users`,{
          "username" : this.state.inputUsername,
          "email" : this.state.inputEmail,
          "password" : this.state.inputPassword
        })
          .then (res => {
            console.log(res.data.token)
            if (res.data == null){
              alert("Tidak Dapat Register")
            }else{
            alert("Akun Berhasil Dibuat silahkan Login")
              this.setState({isLoading:false})
              this.props.navigation.navigate('Login')
            }
          })
        .catch(err =>{
          console.log('erordi auth sign in:',err)
          this.setState({isLoading:false})
          alert('gagal registrasi, pastikan koneksi anda stabil')
        })}
    }


render(){
  return(
    (this.state.isLoading==true) 
    ? 
    <View style={{flexGrow: 1,justifyContent:'center',alignItems: 'center'}}> 
      <Spinner color='#517da2' style={{justifyContent:"center"}} />
      <Text>Loading . . .</Text>
    </View>
    :
  <View style={styles.container}>
<StatusBar  barStyle='dark-content' backgroundColor="#fff" translucent = {true} />
  <View style={styles.wrapperForm} >
    <Text style={styles.title}>Registrasi Sekarang</Text>
    <View style={styles.inputBox} >
    <TextInput 
        value={this.state.inputUsername}
        placeholder="Masukan Nama Anda"
        placeholderTextColor = "grey"
        returnKeyType = {"next"}
        autoFocus = {true}
        onSubmitEditing={() => { this.secondTextInput.focus() }}
        onChangeText={(text)=>this.setState({
            inputUsername:text
        })}
    />
    <IconFA 
        style={{position:"absolute",left:12,top:15}}
        name="user"
        size={16}
        color="rgba(0,0,0,0.5)"
    />
    </View>
    <View style={styles.inputBox} >
    <TextInput 
        value={this.state.inputEmail}
        placeholder="Masukan Email Anda"
        placeholderTextColor = "grey"
        returnKeyType = {"next"}
        ref={(input) => { this.secondTextInput = input; }}
        onSubmitEditing={() => { this.inputPass.focus() }}
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
        ref={(input) => { this.inputPass = input; }}
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

    <TouchableOpacity 
      disabled={(reg.test(this.state.inputEmail) == 0)?true:false}
      style={[styles.button]}
      onPress={this.handleRegister}>
      <Text style={styles.buttonText}>DAFTAR</Text>
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
    width:screenWidth - screenWidth*13/100,
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
