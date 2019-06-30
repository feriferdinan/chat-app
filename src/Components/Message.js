import React from 'react';
import { TouchableOpacity,View, StyleSheet, Text } from 'react-native'

const Message = ({ item }) => (
  
  <TouchableOpacity  >
  
 
  <View style={[
      styles.message, item.incoming &&
      styles.incomingMessage
    ]}>
      <View style={{alignItems:"flex-end"}} >
        <Text style={styles.nameUser} >~ {item.user.name}</Text>
      </View>
      <View style={{flexDirection:"row"}}>
        <View>
          <Text>{item.text}</Text>
        </View>
        <View style={{flex:1,alignContent:"flex-end",alignItems:"flex-end"}} >
          <Text>{item.createdAt.split("T")[1]}</Text>
        </View>
      </View>
  </View>
  </TouchableOpacity>

)

const styles =StyleSheet.create ({
  message: {
    width: '70%',
    margin: 10,
    marginVertical: 3,
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 0,
    borderRadius: 10
  },
  incomingMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#E1FFC7'
  },
  nameUser:{
    fontWeight:"bold"
  } 
})

export default Message;