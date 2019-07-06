import React from 'react';
import {StatusBar,Keyboard,ScrollView,Alert,Modal,Text,TouchableOpacity,View, ImageBackground, StyleSheet,FlatList,AsyncStorage,BackHandler,TextInput ,Button,TouchableHighlight,YellowBox} from 'react-native';
import { ListItem,Icon,Overlay  } from 'react-native-elements';
import Autolink from 'react-native-autolink';

const axios = require('axios');
import configs from '../../../config'

export default class index extends React.Component {
  
  constructor(){
    super()
    this.state={
      messages:[],
      user:[],
      room:[],
      userId:"",
      chatId:"",
      roomId:"",
      text:"",
      token:"",
      chatTittle:"",
      height: 43,
      buttonVisible:false,
      topButtonVisible:false,
      edited:false  
    }
  }

    async componentWillMount(){
      that = this
        const { navigation } = this.props;
        const roomId = await navigation.getParam('roomId');
        const userId = await navigation.getParam('userId');
        const roomName = await navigation.getParam('roomName');
        console.log('ini room id',roomId);
        const valueToken= await AsyncStorage.getItem('token')
        this.setState({
          token:valueToken,
          roomId:roomId,
          userId:userId,
          chatTittle:roomName
        })
        let config = {
          headers: {
            'Authorization': 'bearer ' + that.state.token
          }
        }
        axios.get(`http://${configs.ipaddress}:3333/api/auth/profile`,config)
        .then(function (response) {
          that.setState({
            userId:response.data.id
          })
          console.log('ini user id ',that.state.userId)
        })
        axios.get(`http://${configs.ipaddress}:3333/api/rooms/${that.state.roomId}`,config)
        .then(function (response) {
          that.setState({
            room:response.data
          })
        })
        axios.get(`http://${configs.ipaddress}:3333/api/chats/byroom/${that.state.roomId}`,config)
        .then(function (response) {
          console.log(response.data[0])
          that.setState({
            messages:response.data[0]
          })
        })
        .catch(function (error) {
          console.log(error);
        });
        setInterval(
          this._getData
          ,1500)
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
            'Authorization': 'bearer ' + valueToken
          }
        }
        axios.get(`http://${configs.ipaddress}:3333/api/chats/byroom/${that.state.roomId}`,config)
        .then(function (response) {
          console.log(response.data[0])
          that.setState({
            messages:response.data[0]
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
            'Authorization': 'bearer ' + this.state.token
          }
        }
        axios.delete(`http://${configs.ipaddress}:3333/api/chats/${this.state.chatId}`,config)
        .then(function (response) {
          that.setState({
            chatId:"",
            chatTittle:that.state.room.name,
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
      console.log(id);
      
      that = this
      that.setState({edited:true,
        chatTittle:"Edit Chat?",
        topButtonVisible:true,
       })
       let config = {
        headers: {
          'Authorization': 'bearer ' + this.state.token
        }
      }
      axios.get(`http://${configs.ipaddress}:3333/api/chats/${id}`,config)
      .then(function (response) {
        console.log(response.data.id)
        that.setState({
          text:response.data.text,
          chatId:response.data.id
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
            'Authorization': 'bearer ' + this.state.token
          }
        }
        axios.put(`http://${configs.ipaddress}:3333/api/chats/${that.state.chatId}`,{
          text: this.state.text
        },config)
        .then(function (response) {
          Keyboard.dismiss();
          console.log(response);
          that.setState({
            chatId:"",
            chatTittle:that.state.room.name,
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
              'Authorization': 'bearer ' + this.state.token
            }
          }
          axios.post(`http://${configs.ipaddress}:3333/api/chats`,{
            text: this.state.text,
            room_id: this.state.roomId
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
              style={[styles.buttonCancel,{borderColor:"#fff"}]}
              onPress={()=>this.setState({
                text:"",
                chatId:"",
                edited:false,
                chatTittle:that.state.room.name,
                topButtonVisible:false
              })} >   
          <View>          
          <Text style={{padding:5,paddingHorizontal:13,color:"#FFF"}}>Batal</Text>
          </View>
        </TouchableHighlight>
      </View>
      )
    }
    updateSize = (height) => {
      this.setState({
        height
      });
    }

    render() {
      const {text, height} = this.state;
      let newStyle = {
        height
      }
        return (
            
        <ImageBackground
				  style={[ styles.container, styles.backgroundImage ]}
				  source={require('../../assets/img/backgroundtele.jpg')}>
           <StatusBar  barStyle='light-content' backgroundColor="#426382" translucent = {true} />
           <View style={{margin:12}} />
                <ListItem 
                    containerStyle={{backgroundColor:"#517da2",maxHeight:50}}
                    leftElement={
                      <Icon name="arrowleft" type="antdesign" size={23} color="white" 
                        onPress={()=>this.props.navigation.navigate('Home')}
                      />
                    }
                    title={this.state.chatTittle}
                    subtitle={ this.state.edited==false ? "online" : null }
                    subtitleStyle={{color:"#FFF"}}
                    titleStyle={{fontWeight:"bold",color:"#fff"}}
                    leftAvatar={{  source:this.state.room.type=="group" ? require('../../assets/img/team.png') :require('../../assets/img/user1.png') }}
                    rightElement={
                      (this.state.topButtonVisible==true) ? this.deleteAndCancel() : 
                      <Icon   name= "more-vertical"  color="#fff" size={24} type="feather" />
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
                        <TouchableOpacity 
                          disabled={(this.state.userId==item.user_id) ? false : true} 
                          delayLongPress={100} 
                          onLongPress={()=>this._updateChatConfirm(item.id)} >
                        <View style={ (this.state.userId==item.user_id) ? styles.wrapperMessageRight : styles.wrapperMessageLeft } >
                            <View style={
                                [styles.message,
                                (this.state.userId==item.user_id) ? [styles.incomingMessageRight,{
                                  borderTopLeftRadius:10 ,
                                  borderBottomLeftRadius: 10,
                                  borderTopRightRadius: 10,}] : [styles.incomingMessageLeft,{ 
                                  borderTopLeftRadius:10 ,
                                  borderBottomRightRadius: 10,
                                  borderTopRightRadius: 10,}]]
                                }>

                               { 
                                 (this.state.userId==item.user_id)
                                   ?
                                   <View/>
                                  :
                                  <View style={{  alignItems:"flex-start"}} >
                                    <Text style={styles.nameUser} >{item.username}</Text>
                                   </View>
                                }

                                <View style={{flex:1,flexDirection:"row"}}>
                                  <View style={{flexDirection:"row",flexWrap:"wrap"}} >

                                    <Text style={{color:"#000",alignSelf:"flex-start",paddingRight:10}} >
                                    <Autolink 
                                      text={item.text}
                                    />
                                    </Text>
                                    <Text style={{alignSelf:"flex-end", fontSize:10,color:"green",bottom:-5}} >{item.created_at.split('T')[1].split(':')[0]+":"+item.created_at.split('T')[1].split(':')[1]}</Text>
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
					style={[styles.composeText,newStyle,{maxHeight:120}]}
					value={this.state.text}
					onChangeText={(text) => this.setState({text:text})}
					editable={true}
          multiline={true}
          returnKeyType = {"send"}
          focus={(this.state.text==null) ? false : true}
          autoFocus = {true}
          placeholder="Ketik Pesan"
          onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
				/>
                <TouchableOpacity
                  disabled={(this.state.text=="") ? true : false }   
                  onPress={(this.state.edited==true) ? this._updateChat : this.submitText } >
                    <View
                     style={[styles.button,{ backgroundColor: (this.state.text=="") ? 'rgba(81, 125, 162, 0.5)' : 'rgba(81, 125, 162, 1)' }]}
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
        width: '87%',
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderColor: '#979797',
        borderStyle: 'solid',
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
      },
      compose: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 10,
        borderRadius: 20,
        backgroundColor:"transparent",
        
      },
      button: {
        width:43,
        height:43,
        borderRadius: 100,
        marginVertical: 10,
        paddingVertical: 13,
        alignItems:"center",
        justifyContent:"center",
        alignContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,

        elevation: 8,
      },

    buttonCancel:{
      marginHorizontal:5,
      borderWidth:1,
      borderRadius:5
    },
    wrapperMessageRight:{
      flexDirection: 'row',
      alignSelf: 'flex-end',
    },
    wrapperMessageLeft:{
      flexDirection: 'row',
      alignSelf: 'flex-start',
    },
    message: {
      maxWidth:"85%",
      margin: 10,
      marginVertical: 3,
      padding: 7,
      borderWidth: 0,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.00,
      elevation: 1,
      },
      incomingMessageRight: {
        backgroundColor: '#Effedd'
      },
      incomingMessageLeft: {
        backgroundColor: '#ffff'
      },
      nameUser:{
        fontWeight:"bold",
        fontSize:15,
        color:"#cc7c32"
      } 
   
})