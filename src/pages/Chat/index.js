import React from 'react';
import {Keyboard,ScrollView,Alert,Modal,Text,TouchableOpacity,View, ImageBackground, StyleSheet,FlatList,AsyncStorage,BackHandler,TextInput ,Button,TouchableHighlight,YellowBox} from 'react-native';
import { ListItem,Icon,Overlay  } from 'react-native-elements';

const axios = require('axios');
import configs from '../../../config'

export default class index extends React.Component {
  
  constructor(){
    super()
        this.state={
          messages:[],
          user:[],
          userId:"",
          chatId:"",
          text:"",
          token:"",
          chatTittle:"Public Group Chat",
          buttonVisible:false,
          topButtonVisible:false,
          edited:false  
        }
      }
      
      componentDidMount(){
        setInterval(
          this._getData
          ,1500)
      }
      async componentWillMount(){
        
      that = this
        const valueToken= await AsyncStorage.getItem('token')
        this.setState({
          token:valueToken
        })
        let config = {
          headers: {
            'Authorization': 'jwt ' + that.state.token
          }
        }
        axios.get(`http://${configs.ipaddress}:3000/user`,config)
        .then(function (response) {
          that.setState({
            userId:response.data.data.id
          })
          console.log(that.state.userId)
        })
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
    
    handleLogout = () =>{
        AsyncStorage.clear();
        this.props.navigation.navigate('Login')
    }

    _getData = async () => {
        that = this
        const valueToken= await AsyncStorage.getItem('token')
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
    
    _deleteChatConfirm = (id) => {
      this.setState({chatId:id})
          Alert.alert(
          'Hapus Chat?',
          "",
          [
            {text: 'Hapus', onPress:()=> this._deleteChat() },
            {text: 'Batal',
            style: 'cancel',
            },
          ],
          {cancelable: true},
        );
    }
    
    _deleteChat = () => {
        console.log(this.state.chatId)
        that = this
            
         let config = {
          headers: {
            'Authorization': 'jwt ' + this.state.token
          }
        }
        axios.delete(`http://${configs.ipaddress}:3000/chat/${this.state.chatId}`,config)
        .then(function (response) {
          that.setState({
            chatId:"",
            chatTittle:"Public Group Chat",
            text:"",
            edited:false,
            topButtonVisible:false
        })
            console.log(response.data)
          
          
        })
        
        .catch(function (error) {
          console.log(error);
        });
    }
    _updateChatConfirm =(id)=>{
      that = this
      that.setState({edited:true,
        chatTittle:"Edit Chat?",
        topButtonVisible:true,
       })
       let config = {
        headers: {
          'Authorization': 'jwt ' + this.state.token
        }
      }
      axios.get(`http://${configs.ipaddress}:3000/chat/${id}`,config)
      .then(function (response) {
        console.log(response.data.data)
        that.setState({
         text:response.data.data.text,
         chatId:response.data.data.id
        })
      })
      .catch(function (error) {
        console.log(error);
      });

    }

    _updateChat = () =>{
      that=this
      console.log(that.state.chatId);
      
      let config = {
          headers: {
            'Authorization': 'jwt ' + this.state.token
          }
        }
        axios.patch(`http://${configs.ipaddress}:3000/chat/${that.state.chatId}`,{
          text: this.state.text
        },config)
        .then(function (response) {
          Keyboard.dismiss();
          console.log(response);
          that.setState({
            chatId:"",
            chatTittle:"Public Group Chat",
            text:"",
            edited:false,
            topButtonVisible:false
        })
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    

    submitText = ()=>{
        that=this
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
            Keyboard.dismiss();
            that.setState({
              text:""
          })
          })
          .catch(function (error) {
            console.log(error);
          });
    }  

    deleteAndCancel= ()=> {
      return(
        <View style={{flexDirection:"row"}} >
        <TouchableHighlight 
          underlayColor="#f8f9fa"
          style={[styles.buttonCancel,{backgroundColor:"#dc3545",borderWidth:0}]}
          onPress={()=>this._deleteChatConfirm(this.state.chatId)} >   
        <View>          
        <Text style={{padding:5,paddingHorizontal:10,color:"#ffff"}} >Hapus</Text>
        </View>
        </TouchableHighlight>
          <TouchableHighlight
            underlayColor="#f8f9fa" 
            style={[styles.buttonCancel,{borderColor:"#8a9093"}]}
            onPress={()=>this.setState({
              text:"",
              chatId:"",
              edited:false,
              chatTittle:"Public Group Chat",
              topButtonVisible:false
            })} >   
        <View>          
        <Text style={{padding:5,paddingHorizontal:13,color:"black"}}>Batal</Text>
        </View>
      </TouchableHighlight>
      </View>
      )
    }

    render() {
        return (
            
        <ImageBackground
				  style={[ styles.container, styles.backgroundImage ]}
				  source={require('../../assets/img/background.png')}>
                <ListItem 
                    containerStyle={{backgroundColor:"#eeeeee"}}
                    title={this.state.chatTittle}
                    titleStyle={{fontWeight:"bold"}}
                    leftElement={
                      (this.state.edited==true)?<View/>:
                        <TouchableHighlight
                          style={styles.buttonCancel}
                          onPress={this.handleLogout} >   
                            <View style={{flexDirection:"row",padding:5}} >          
                              <Icon name="left" type="antdesign" color="grey" size={16} />
                              <Text>Logout</Text>
                            </View>
                        </TouchableHighlight>
                    }
                    rightElement={
                      (this.state.topButtonVisible==true) ? this.deleteAndCancel() : <View/>
                    }
                />
        <ScrollView 
          ref={ref => this.scrollView = ref}
          onContentSizeChange={(contentWidth, contentHeight)=>{        
          this.scrollView.scrollToEnd({animated: true});
          }}
         >        
				<FlatList
					style={styles.container}
					data={this.state.messages}
					keyExtractor={(item, index) => (`message-${index}`)}
					renderItem={Message = ({ item }) => (
                        <View>
                        <TouchableOpacity  disabled={(this.state.userId==item.user_id) ? false : true} onLongPress={()=>this._updateChatConfirm(item.id)} >
                        <View style={ (this.state.userId==item.user_id) ? styles.wrapperMessageRight : styles.wrapperMessageLeft } >
                            <View style={
                                [styles.message,
                                (this.state.userId==item.user_id) ? styles.incomingMessageRight : styles.incomingMessageLeft]
                                }>

                               { 
                                 (this.state.userId==item.user_id)
                                   ?
                                   <View/>
                                  :
                                  <View style={{  alignItems:"flex-end"}} >
                                    <Text style={styles.nameUser} >~ {item.user.name}</Text>
                                   </View>
                                }

                                <View style={{flex:1,flexDirection:"row",flexWrap:"wrap"}}>
                                    <View>
                                    <Text>{item.text}</Text>
                                    </View>
                                    <View style={{flex:1,alignItems:"flex-end"}} >
                                    <Text>{item.createdAt.split('T')[1].split(':').concat().slice(0,2)}</Text>
                                    </View>
                                </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                        </View>
                    )}
				/>
        </ScrollView>
				<View style={styles.compose}>
				<TextInput
					style={styles.composeText}
					value={this.state.text}
					onChangeText={(text) => this.setState({text:text})}
					editable = {true}
          returnKeyType = {"send"}
          focus={(this.state.text==null)?false:true}
          autoFocus = {true}
					maxLength = {40}
          placeholder="Ketik Pesan"
				/>
                <TouchableOpacity   onPress={(this.state.edited==true) ? this._updateChat : this.submitText } >
                    <View
                     style={styles.button}
                     >
                    { (this.state.edited==true)?
                    <Icon name="pencil" color="#fff" size={30} type="evilicon" />  
                    :
                    <Icon name="md-send" color="#fff" size={23} type="ionicon" />  
                    }
                    </View>
                </TouchableOpacity>
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
    composeText: {
        width: '85%',
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
        backgroundColor:"transparent"
      },
      button: {
        width:40,
        height:40,
        backgroundColor:'#1c313a',
        borderRadius: 100,
        marginVertical: 10,
        paddingVertical: 13,
        alignItems:"center",
        justifyContent:"center",
        alignContent: 'center',
      },

    buttonCancel:{
      marginHorizontal:5,
      borderWidth:1,
      borderRadius:5
    },
    wrapperMessageRight:{
      flexDirection: 'row', justifyContent: 'flex-end'
    },
    wrapperMessageLeft:{
      flexDirection: 'row',
    },
    message: {
        width:"70%",
        margin: 10,
        marginVertical: 3,
        padding: 10,
        borderWidth: 0,
        borderRadius: 10
      },
      incomingMessageRight: {
        backgroundColor: '#E1FFC7'
      },
      incomingMessageLeft: {
        backgroundColor: '#ffff'
      },
      nameUser:{
        fontWeight:"bold"
      } 
   
})