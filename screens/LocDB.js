import React, {useState, useEffect} from 'react';
import { View, Image, Alert,Dimensions, SafeAreaView, KeyboardAvoidingView, Button, Pressable,Text,TextInput, StyleSheet } from 'react-native';
import {useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged} from 'firebase/auth';
import { getFirestore, updateDoc, doc, getDoc, onSnapshot, collection } from 'firebase/firestore';
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import UserDetailsScreen from './UserDetailsScreen';
import db from "../firebase";
import * as SMS from 'expo-sms';



const firestore = getFirestore();
const firebaseConfig = {
    // **ENTER FIREBASE PROJECT DETAILS HERE**    
  };
initializeApp(firebaseConfig);
const auth = getAuth();


const LocDB = ({props}) =>{
    const navigation = useNavigation();
    const user = auth.currentUser;
    const path = "AppUsers/"+user.email;
    const docRef = doc(firestore,path);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [time, setTime] = useState('');
    const [alertTime, setAlertTime] = useState('');
    const d = new Date();
    const [userName, setUserName] = useState("")
    const [famname, setFamname] = useState("")
    const [famemail, setFamemail] = useState("")
    const [snap, setSnap] = useState(false);
    const [message, setMessage] = useState("No Danger");
    const [recipients, setRecipients] = useState(['8617583807']);
    const [sms, setSms] = useState("Your family member sent a SOS alert!\nOpen FamCon for more details.");


    useEffect(()=>{
        const NameFetch= async()=>
        {    
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserName ( docSnap.data().name);
                setFamname ( docSnap.data().famname);   
                setFamemail ( docSnap.data().famemail); 
            } else {
            console.log(path);
            }
        }
        NameFetch()    
    }, []);
    
    if(famemail!=""){
        const path2 = "AppUsers/"+famemail;
        const docRef2 = doc(firestore,path2);
        onSnapshot(docRef2, (snapshot)=>{
            setSnap(snapshot.data().danger);
            
        })
    }

    useEffect(()=>{
            if(snap){
                setMessage("Unsafe!");
                //console.log("Danger!");
            }
            else{
                setMessage("Safe!");
                //console.log("Safe!");
            }
    }, [snap]);
    

    const timer = () =>{
        setTime(d.getTime());
    }

    const handleLogout=()=>{
        auth.signOut()
            .then(()=>{
              navigation.replace("Login")
            })
            .catch(error=>alert(error.message))
      }

    // Update User Details   Try diff functions, use hooks to store the lat and long
    const storeLocation = async () => {        
        if (Platform.OS === 'android' && !Constants.isDevice) {
            setErrorMsg(
            'Location API Error!'
            );
            return;
        }
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        let latitude 
        let longitude
        if (errorMsg) {
            latitude = errorMsg;
        } else if (location) {
            latitude = parseFloat(JSON.stringify(location.coords.latitude));
            longitude = parseFloat(JSON.stringify(location.coords.longitude));
        }       
        
        
        const coordinates = [{latitude:latitude, longitude: longitude}];
        const user = auth.currentUser;
        const path = "AppUsers/"+user.email;
        const docRef = doc(firestore,path)
                console.log("Location");
        const locationInfo = {
            email: user.email,
            latitude:coordinates[0].latitude,
            longitude:coordinates[0].longitude,
        };
        updateDoc(docRef, locationInfo);
                console.log("Updated");
        showMessage({
            message: "Location Updated!",
            type: "success",
            icon:"success",
            animationDuration:500,
            style:{
                height:80, 
                alignItems:'center',
                marginTop:30,  
            }
            });
            
    }

    const sendSms = async () => {   
        const {result} = await SMS.sendSMSAsync(
          recipients,
          sms
        );
      };

    const help = async () => {        
        const dangerUpdate = {
            danger: 1,
        };
        updateDoc(docRef, dangerUpdate);
                
        showMessage({
            message: "SOS Alert Sent!",
            type: "danger",
            icon:"info",
            animationDuration:500,
            style:{
                height:80, 
                alignItems:'center',
                marginTop:30,  
            }
            });

            
    }

    

    const okay = async () => {        
        const dangerUpdate = {
            danger: 0,
        };
        updateDoc(docRef, dangerUpdate);
                
        showMessage({
            message: "Status Updated!",
            type: "info",
            icon:"success",
            animationDuration:500,
            style:{
                height:80, 
                alignItems:'center',
                marginTop:30,  
            }
            });
    }

    const createTwoButtonAlert = () => {
        var buttonTimer = setTimeout(()=>{storeLocation(); help(); sendSms();}, 5000);
        Alert.alert(
            "Are you Safe?",
            "If you don't respond,\nSOS will be sent automatically in 10secs!",
            [
                {
                    text: "No",
                    onPress: () => {clearTimeout(buttonTimer); storeLocation(); help(); sendSms(); },
                    style: "cancel"
                },
                { 
                    text: "Yes I Am", 
                    onPress: ()=> {
                        clearTimeout(buttonTimer),
                        setAlertTime(d.getTime()), 
                        setTime(d.getTime()), 
                        setTimeout(createTwoButtonAlert, 2000)}
                },
                {
                    text: "End Alerts",
                    style: "cancel",
                    onPress: () => clearTimeout(buttonTimer),
                    
                },
            ]
            );
    }
    

return (
    <KeyboardAvoidingView style={styles.centeredView}>
    <View style={styles.headingCont1}>
        <Text style={styles.heading1}>FamCon</Text>
        <Text style={styles.heading2}>Stay connected to your family</Text>
        
    </View>
    <Pressable
        style={[styles.button]}
        onPress={storeLocation}
        android_ripple={{color: 'white', borderless: false}}
    >
        <Text style={styles.buttonText}>Upload Location</Text>
    </Pressable>
    <Pressable
        style={[styles.button]}
        onPress={()=>{setAlertTime(d.getTime()), setTimeout(createTwoButtonAlert, 10)}}
        android_ripple={{color: 'white', borderless: false}}
    >
        <Text style={styles.buttonText}>Send Me Alerts</Text>
    </Pressable>

    <Pressable
        style={[styles.button]}
        onPress={okay}
        android_ripple={{color: 'white', borderless: false}}
    >
        <Text style={styles.buttonText}>I'm Safe</Text>
    </Pressable>
    

    <View style={{flex:9, width: Dimensions.get('window').width,backgroundColor:'white',alignItems:'center', justifyContent:'center'}}>
        <Text style={{fontSize:20,}}>{snap.danger}</Text>
        {/* <Image
            style={styles.logo}
            source={require('../assets/userIcon.png')}
        /> */}
        <View style={styles.headingCont2}>
            <Text style={styles.userName1}>Hello</Text><Text style={styles.userName2}> {userName.split(" ")[0]}</Text>
        </View>
        <View style={styles.headingCont2}>
            <Text style={styles.userName3}>Family Member:</Text><Text style={styles.userName4}> {famname.split(" ")[0]}</Text>
        </View>
        <View style={styles.headingCont2}>    
            <Text style={styles.userName3}>Family Status:</Text><Text style={styles.userName4}> {message}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
            <Pressable 
                onPress={handleLogout} style={styles.button2}>
                <Text style={styles.profileButton}>Logout</Text>
            </Pressable> 
            <Pressable 
                onPress={()=>navigation.navigate('UserDetailsScreen')} style={styles.button2}>
                <Text style={styles.profileButton}>Edit</Text>
            </Pressable> 
        </View>
        
    </View>
    <FlashMessage position="top" />
    </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems:'center',
      paddingTop: 50,
      backgroundColor: 'white',
      flexDirection:"column" 
    },
    famcon:{
        alignItems:'center',
        justifyContent:'center',
        height:200,
        width:200,
    },
    heading1:{
        justifyContent:'flex-end',
        alignContent:'flex-end',
        color:'teal',
        fontFamily: 'sans-serif-medium',
        fontSize:30,
        fontWeight:'bold',
    },
    heading2:{
        justifyContent:'flex-end',
        fontFamily: 'sans-serif-thin',
        fontSize:20,
    },
    userName1:{
        justifyContent:'flex-end',
        fontFamily: 'sans-serif-thin',
        fontSize:22,
        textAlignVertical:'center',
    },
    userName2:{
        justifyContent:'flex-end',
        color:'teal',
        fontFamily: 'sans-serif-medium',
        fontSize:24,
        fontWeight:'bold',
        textAlignVertical:'bottom',
    },
    userName3:{
        color:'black',
        justifyContent:'flex-end',
        fontFamily: 'sans-serif-thin',
        fontSize:17,
        textAlignVertical:'center'
       
    },
    userName4:{
        justifyContent:'flex-end',
        color:'teal',
        fontFamily: 'sans-serif-medium',
        fontSize:18,
        fontWeight:'bold',
        textAlignVertical:'bottom',
    },
    headingCont1:{
        flex: 7,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        width:Dimensions.get('window').width,
        
    },
    headingCont2:{
        padding:10,
        justifyContent:'center',
        flexDirection:'row',
    },
    logo:{
        alignItems:'center',
        justifyContent:'center',
        height:30,
        width:30,
    },
    
    button: {
      flex:1,
      borderRadius: 10,
      padding: 10,
      elevation: 2, 
      backgroundColor: "teal",
      margin: 10,
      width:150,
      justifyContent:'center'
    },   
    button2: {
        borderRadius: 10,
        margin: 10,
        width:80,
        height: 30,
        justifyContent:'center',
        borderColor: 'teal',
        borderWidth:1,
      },  
    buttonText: {
        textAlign:'center', color:'white', fontWeight:'bold',fontSize:15
    },
    profileButton:{
        textAlign:'center',
        justifyContent:'flex-end',
        alignContent:'flex-end',
        color:'teal',
        fontFamily: 'sans-serif-medium',
        fontSize:17,
        fontWeight:'bold',
    }
  });
  
  export default LocDB;