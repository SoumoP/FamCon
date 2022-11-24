import React, {useState, useEffect} from 'react';
import { View, Dimensions, Alert, SafeAreaView, KeyboardAvoidingView, Button, Pressable,Text,TextInput, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged} from 'firebase/auth';
import { getFirestore, setDoc,updateDoc, doc, getDoc } from 'firebase/firestore';
import Tabs from '../navigation/tabs';
import SignupScreen from './SignupScreen'


const firestore = getFirestore();
const firebaseConfig = {
  
};
initializeApp(firebaseConfig);
const auth = getAuth();


const UserDetailsScreen = () =>{
    const [famname, setFamname] = useState("");
    const [mob, setMob] = useState("");
    const [family, setFamily] = useState("")
    const navigation = useNavigation();
    const user = auth.currentUser;
    const path = "AppUsers/"+user.email;
    const docRef = doc(firestore,path)

// Update User Details
    const storeDetails = ()=>{
        const userInfo = {
          famname: famname,
          famemail: family,
          mob: mob,
        };
        updateDoc(docRef, userInfo);
        console.log("User Info Updated");
        
        navigation.navigate('Tabs')
    }

    return (
      <KeyboardAvoidingView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.heading1}>Edit Family</Text>
        
        <TextInput
          style={styles.input}
          onChangeText={
            text=>setFamily(text)
          }
          value={family}
          placeholder="Family Email"
          keyboardType="email-address"
        /> 
        <TextInput
          style={styles.input}
          onChangeText={
            text=>setFamname(text)
          }
          value={famname}
          placeholder="Family Member Name"
          keyboardType="default"
        /> 
        <TextInput
          style={styles.input}
          onChangeText={
            text=>setMob(text)
          }
          value={mob}
          placeholder="Mobile No."
          keyboardType="number-pad"
        /> 
        <View style={{flexDirection:'row'}}>
        <Pressable
          style={[styles.button]}
          onPress={storeDetails}
        >
            <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
        <Pressable
          style={[styles.button]}
          onPress={()=>navigation.navigate('Tabs')}
        >
            <Text style={styles.buttonText}>Back</Text>
        </Pressable>

        </View>
  
      </KeyboardAvoidingView>
    );
  }

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
      backgroundColor: 'white',
    },
    input: {
      height: 50,
      width: Dimensions.get('window').width-100,
      margin: 5,
      borderBottomWidth: 1,
      padding: 5,
      paddingLeft:15,
      backgroundColor: "white"
    },
    button: {
      borderRadius: 10,
      padding: 10,
      elevation: 5, backgroundColor: "teal",
      margin: 10,
      width:Dimensions.get('window').width-256
    },
    heading1:{
      justifyContent:'flex-end',
      alignContent:'flex-end',
      color:'teal',
      fontFamily: 'sans-serif-medium',
      fontSize:30,
      fontWeight:'bold',
      marginBottom:30,
  },
  buttonText: {
    textAlign:'center', color:'white', fontWeight:'bold',fontSize:15
  },
    
  });
  
  export default UserDetailsScreen;
  
    
  