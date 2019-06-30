import React from 'react';
import {Alert,Modal,Text,TouchableOpacity,View, ImageBackground, StyleSheet, FlatList,AsyncStorage,BackHandler,TextInput ,Button,TouchableHighlight} from 'react-native';
import { ListItem,Icon,Overlay  } from 'react-native-elements';
import Popover from 'react-native-popover-view'
// import Message from '../../Components/Message';

const axios = require('axios');
import configs from '../../../config'
import {StackNavigator} from 'react-navigation';

export default class index extends React.Component {
  
  constructor(){
    super()
        this.state={
          messages:[],
          user:[],
          userId:"",
          chatId:"",
          text:"",
          submittedText:'',
          token:"",
          chatTittle:"Public Group Chat",
          buttonVisible:false,
          modalVisible:false,
          topButtonVisible:false,

          edited:false  
        }
        setInterval(
          this._getData
          ,2000)
    }
    setModalVisible(visible){
        this.setState({modalVisible:visible})
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
        this.setModalVisible(false)
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
        this.setModalVisible(false)
        console.log(this.state.chatId)
        that = this
         let config = {
          headers: {
            'Authorization': 'jwt ' + this.state.token
          }
        }
        axios.delete(`http://${configs.ipaddress}:3000/chat/${this.state.chatId}`,config)
        .then(function (response) {
          console.log(response.data)
        })
        
        .catch(function (error) {
          console.log(error);
        });
      }
    _updateChatConfirm =(id)=>{
      
      that = this
      that.setState({edited:true,chatTittle:"",topButtonVisible:true })
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
        that.setModalVisible(false)
      })
      
      .catch(function (error) {
        console.log(error);
      });

    }

    _updateChat = (id) =>{
      that=this
      let config = {
          headers: {
            'Authorization': 'jwt ' + this.state.token
          }
        }
        axios.patch(`http://${configs.ipaddress}:3000/chat/${this.state.chatId}`,{
          text: this.state.text
        },config)
        .then(function (response) {
          console.log(response);
          that.setState({
            chatId:"",
            chatTittle:"Public Group Chat",
            text:"",
            edited:false
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
        axios.get(`http://${configs.ipaddress}:3000/user`,config)
        .then(function (response) {
          that.setState({
            userId:response.data.data.id
          })
          console.log(that.state.userId)
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
        <TouchableOpacity >   
        <View style={{marginHorizontal:5}} >          
        <Text></Text>
        </View>
    </TouchableOpacity>
      <TouchableOpacity onPress={()=>this.setState({
        text:"",
        chatId:"",
        edited:false,
        chatTittle:"Public Group Chat",
        topButtonVisible:false
      })} >   
        <View style={{marginHorizontal:5,color:"#8a9093"}} >          
        <Text>Batal</Text>
        </View>
    </TouchableOpacity>
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
                    <TouchableOpacity onPress={this.handleLogout} >   
                        <View style={{flexDirection:"row"}} >          
                        <Icon name="arrowleft" type="antdesign" color="grey" size={20} />
                        <Text>Logout</Text>
                        </View>
                    </TouchableOpacity>
                    }
                    rightElement={
                      (this.state.topButtonVisible==true) ? this.deleteAndCancel() : <View/>
                    }
                   
                />
                
				<FlatList
					style={styles.container}
					data={this.state.messages}
					keyExtractor={(item, index) => (`message-${index}`)}
					renderItem={Message = ({ item }) => (
                        <View>
                         <Modal
                          animationType="slide"
                          transparent={true}
                          visible={this.state.modalVisible}
                          >
                          <TouchableOpacity  onPress={()=>this.setModalVisible(false)} >
                          <View style={{height:460,backgroundColor:"rgba(0, 0, 0, 0.3)"}} />
                          </TouchableOpacity>
                          <TouchableOpacity   >
                            <View style={{positon:"absolute",bottom:0}}>
                                  <ListItem 
                                      containerStyle={{backgroundColor:"#ffff"}}
                                      title="Hapus"
                                      leftIcon={{ name:"trash",type:"evilicon", color:'grey' }}
                                      onPress={()=> this._deleteChatConfirm(item.id)}
                                  />
                                  <ListItem 
                                      containerStyle={{backgroundColor:"#ffff"}}
                                      title="Edit"
                                      leftIcon={{ name:"pencil",type:"evilicon", color:'grey' }}
                                      onPress={()=> this._updateChatConfirm(item.id)}
                                  />
                              </View>
                            </TouchableOpacity>  
                        </Modal>
                        <TouchableOpacity  disabled={(this.state.userId==item.user_id) ? false : true} onLongPress={()=>this.setModalVisible(true)} >
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

                                <View style={{flexDirection:"row"}}>
                                    <View>
                                    <Text>{item.text}</Text>
                                    </View>
                                    <View style={{flex:1,alignContent:"flex-end",alignItems:"flex-end"}} >
                                    <Text>{item.createdAt.split('T')[1].split(':').concat().slice(0,2)}</Text>
                                    </View>
                                </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                        </View>
                    )}
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
                <TouchableOpacity  onPress={(this.state.edited==true) ? this._updateChat : this.submitText } >
                    <View
                     style={styles.button}
                     >
                    { (this.state.edited==true)?
                    <Icon name="pencil" color="#fff" size={22} type="evilicon" />  
                    :
                    <Icon name="md-send" color="#fff" size={25} type="ionicon" />  
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
      },
      button: {
        width:40,
        height:40,
        backgroundColor:'#1c313a',
        borderRadius: 100,
        marginVertical: 10,
        paddingVertical: 13,
        alignItems:"center",
        justifyContent:"center"
    },
    wrapperMessageRight:{
      flexDirection: 'row', justifyContent: 'flex-end'
    },
    wrapperMessageLeft:{
      
    },
    message: {
        width: '70%',
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