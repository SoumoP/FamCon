import React, {useState, useEffect} from 'react';
import { Dimensions, KeyboardAvoidingView, Pressable,Text,TextInput, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';

const firebaseConfig = {
  
};
initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore();

const SignupScreen=() => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [famemail, setFamemail] = useState("");
    const [famname, setFamname] = useState("");
    const [mob, setMob] = useState("");

    const navigation = useNavigation();
    useEffect(()=>{
      const logout = onAuthStateChanged(auth, (user)=>{
        if(user){
          navigation.navigate('Tabs')
        }
      })
    })
    
    const handleSignUp = () =>{
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential)=>{
        const user = userCredential.user;
      }).catch = (error => alert(error.message))
      storeDetails();
    }
    const storeDetails = () =>{
      const path = "AppUsers/"+email;
      const docRef = doc(firestore,path)
         console.log("Name");
      const locationInfo = {
          name: name,
          email: email,
          famname: famname,
          famemail: famemail,
          mob: mob,
          danger: 0,
      };
      setDoc(docRef, locationInfo);
          console.log("Updated");
    }
    return (
      <KeyboardAvoidingView style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:'#f2f2f2'}}>
        <Text style={styles.heading1}>Sign Up</Text>
        
        <TextInput
          style={styles.input}
          onChangeText={text=>setName(text)}
          value={name}
          placeholder="Name"
          keyboardType="default"
        />

        <TextInput
          style={styles.input}
          onChangeText={text=>setEmail(text)}
          value={email}
          placeholder="Email"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          onChangeText={text=>setFamname(text)}
          value={famname}
          placeholder="Family Name"
          keyboardType="default"
        />

        <TextInput
          style={styles.input}
          onChangeText={text=>setFamemail(text)}
          value={famemail}
          placeholder="Family Email"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          onChangeText={text=>setMob(text)}
          value={mob}
          placeholder="Family Mobile No."
          keyboardType="number-pad"
        />
  
        <TextInput
          style={styles.input}
          onChangeText={text=>setPassword(text)}
          value={password}
          placeholder="Password"
          keyboardType="default"
          secureTextEntry
        />
        
     
        <Pressable
              style={[styles.button]}
              onPress={handleSignUp}
              android_ripple={{color: 'white', borderless: false}}
            >
              <Text style={styles.buttonText}>Signup</Text>
            </Pressable>
            <Text>Or</Text>
            <Pressable
              onPress={() => navigation.navigate('Login')}
              style={styles.button2}
            >
              <Text style={styles.button2text}>Login</Text>
            </Pressable>

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
    heading1:{
      justifyContent:'flex-end',
      alignContent:'flex-end',
      color:'teal',
      fontFamily: 'sans-serif-medium',
      fontSize:25,
      fontWeight:'bold',
      paddingBottom: 30,
  },

  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: "teal",
    margin: 10,
    width:80,
    height:40,
  },
  button2:{
    borderRadius: 10,
    margin: 10,
    width:80,
    height: 40,
    justifyContent:'center',
    borderColor: 'teal',
    borderWidth:1,
    backgroundColor:"white"
},
button2text:{
  textAlign:'center',
  justifyContent:'flex-end',
  alignContent:'flex-end',
  color:'teal',
  fontFamily: 'sans-serif-medium',
  fontSize:17,
  fontWeight:'bold',
},
buttonText: {
textAlign:'center', color:'white', fontWeight:'bold',fontSize:15
},
  });
  
  export default SignupScreen;
  
  
  
  