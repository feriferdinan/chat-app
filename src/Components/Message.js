import React from 'react';
import { View, StyleSheet, Text } from 'react-native'

const Message = ({ item }) => (
  <View style={[
      styles.message, item.incoming &&
      styles.incomingMessage
    ]}>
    <View style={{alignItems:"flex-end"}} >
    <Text style={styles.nameUser} >~ {item.user.name}</Text>
    </View>
    <Text>{item.text}</Text>
  </View>
)

const styles = {
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
    fontSize: 11,
   
  } 
}

export default Message;