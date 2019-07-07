import React from 'react';
import {StatusBar,Keyboard,ScrollView,Modal,Text,TouchableOpacity,View, ImageBackground, StyleSheet,FlatList,AsyncStorage,BackHandler,TextInput ,Button,TouchableHighlight,YellowBox,Alert} from 'react-native';
import { ListItem,Icon,Divider ,Badge,Avatar } from 'react-native-elements';

const axios = require('axios');
import configs from '../../../config'

export default class index extends React.Component {
    constructor(){
        super()
        this.state={
            token:"",
            rooms:[],
            userId:""
        }
    }

    

    async componentDidMount(){
          that = this
          const valueToken= await AsyncStorage.getItem('token')
          this.setState({
            token:valueToken
          })
          let config = {
            headers: {
              'Authorization': 'bearer ' + that.state.token
            }
          }
          axios.get(`http://${configs.ipaddress}:3333/api/users/withroom`,config)
          .then(function (response) {
            console.log(response.data.room)
            that.setState({
              rooms:response.data.room
            })
          })
        axios.get(`http://${configs.ipaddress}:3333/api/auth/profile`,config)
        .then(function (response) {
          that.setState({
            userId:response.data.id
          })
          console.log('ini user id ',that.state.userId)
        })
          .catch(function (error) {
            console.log(error);
          });

          
      }

    handleLogout =  () =>{
        Alert.alert(
          'Mau Logout ?',
          `Yakin ? `,
          [
            {text: 'Batal',},
            {text: 'Logout', onPress:()=>
             [AsyncStorage.clear(),
              this.props.navigation.navigate('Login')]},
          ],
         
        );
    }

  

    render() {
        return (
            
            <View style={[ styles.container,{backgroundColor:"#ffff"} ]}>
            <StatusBar  barStyle='light-content' backgroundColor="#426382" />
            
                <ListItem 
                    containerStyle={{backgroundColor:"#517da2",maxHeight:50}}
                    title="Obrolan"
                    leftIcon={{name:"menu",type:"entypo",size:30,color:"#FFF"}}
                    titleStyle={{fontWeight:"bold",justifyContent:"center",color:"#fff",fontSize:22}}
                    rightElement={
                        <TouchableHighlight
                          onPress={this.handleLogout} >   
                            <View style={{flexDirection:"row",padding:5}} >          
                              <Text style={{color:"#fff"}} >Logout</Text>
                              <Icon name="right" type="antdesign" color="#FFF" size={16} />
                            </View>
                        </TouchableHighlight>
                    }
                    
                />
        <ScrollView> 
        <FlatList
					style={styles.container}
					data={this.state.rooms}
					keyExtractor={(item, index) => (`room-${index}`)}
					renderItem={Room = ({ item }) => (
                        <View>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('Chat',{
                            roomId:item.id,
                            userId:this.state.userId,
                            roomName:item.name
                        })}>
                        <Divider style={{ alignSelf:"flex-end", backgroundColor: '#dbdbdb',width:'83%',height:0.3 }} />   
                        <ListItem 
                            containerStyle={{backgroundColor:"#fff"}}
                              
                            leftAvatar={{  source:item.type=="group" ? require('../../assets/img/team.png') :require('../../assets/img/user1.png') }}
                            
                            title={item.name}
                            subtitle={(item.chat[0]==undefined) ? "empty chat" : item.chat[0].user.username.substring(0,10)+": "+ item.chat[0].text.substring(0,25)}
                            titleStyle={{fontWeight:"bold",justifyContent:"center",color:"#2a2a2a",fontSize:18}}
                            rightElement={
                              <Text>{ (item.chat[0]==undefined) ? "" : item.chat[0].created_at.split(' ')[1].split(':')[0]+":"+item.chat[0].created_at.split(' ')[1].split(':')[1]}</Text>
                            }        
                        />
                        </TouchableOpacity> 

                        </View>
          )}
				/>
        </ScrollView>
            <View style={{flexDirection:"column",alignItems:"flex-end"}} >
            <TouchableOpacity>
              <View style={styles.buttonCircle} >
                  <Icon name="pencil" type="material-community" color="#fff" size={26} />
              </View>
            </TouchableOpacity>
            </View>   
			</View>
        )
    }
}





const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    buttonCircle:{
    margin:15,
    width:55,
    height:55,
    borderRadius:100,
    backgroundColor:"#66a9e0",
    justifyContent:"center",
    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 4,
},
shadowOpacity: 0.30,
shadowRadius: 4.65,

elevation: 8,
  }
   
   
})