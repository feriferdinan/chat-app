import React, { Component } from 'react';
import {
StyleSheet,
Text,
View,
TextInput,
TouchableOpacity,
AsyncStorage,
Alert,
StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const axios = require('axios');
import configs from '../../../config'


export default class index extends Component {
    constructor(){
        super()
      
                      
        this.state={
            inputEmail:"",
            inputPassword:"",
            icEye: 'visibility-off',
            showPassword: true
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
              this.props.navigation.navigate('Home')
            }
          })
        .catch(err =>{
          console.log('erordi auth sign in:',err)
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
        })
    }


render(){
return(

<View style={styles.container}>
<StatusBar  barStyle='dark-content' backgroundColor="#fff" translucent = {true} />
  <View style={styles.wrapperForm} >
    <Text style={styles.title}>ARKACHAT</Text>
    <View style={styles.inputBox} >
    <TextInput 
        placeholder="Masukan Email Anda"
        placeholderTextColor = "grey"
        returnKeyType = {"next"}
        autoFocus = {true}
        onSubmitEditing={() => { this.secondTextInput }}
        onChangeText={(text)=>this.setState({
            inputEmail:text
        })}
    />
    {/* <Icon 
        style={styles.icon}
        name="email"
        size={30}
        color={componentColors.password_icon_color}
        onPress={this.changePwdType}
    /> */}
    </View>
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
        style={styles.icon}
        name={this.state.icEye}
        size={30}
        color={componentColors.password_icon_color}
        onPress={this.changePwdType}
    />
    </View>

    <TouchableOpacity 
      style={styles.button}
      onPress={this.handleLogin}>
      <Text style={styles.buttonText}>MASUK</Text>
    </TouchableOpacity>
</View>
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
  color:"#fff",
  margin:10,
 
},
inputBox: {
    width:"90%",
    borderRadius: 25,
    paddingHorizontal:16,
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
  width:"95%",
  backgroundColor:'rgba(86,130,163,0.6)',
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
  top: 10,
  right: 10
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
  password_icon_color:'#517da2',
};
