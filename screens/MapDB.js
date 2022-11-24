import React, { useState, useEffect } from 'react';
import MapView, { Callout, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Pressable, Text, View, Dimensions, Image, SafeAreaView,  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';



const firebaseConfig = {
  
};
initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore();

const MapDB = ()=> {

    const user = auth.currentUser;
    const path = "AppUsers/"+user.email;
    const docRef = doc(firestore,path);
    const navigation = useNavigation();
    const [famemail, setFamemail] = useState("")
    const [famname, setFamname] = useState("")
    const [lat, setLat] = useState(11)
    const [long, setLong] = useState(22)
    const [markerlat, setMarkerlat] = useState(11)
    const [markerlong, setMarkerlong] = useState(22)
    const [latdel, setLatdel] = useState(0.05)
    const [longdel, setLongdel] = useState(0.05)
    const [mylat, setMylat] = useState(11)
    const [mylong, setMylong] = useState(22)
    const [famlat, setFamlat] = useState(11)
    const [famlong, setFamlong] = useState(22)
    
    
    useEffect(()=>{
      //fetch fam email
      const EmailFetch= async()=>
      {    
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFamemail(docSnap.data().famemail) 
          } else {
            console.log("No such email!");
          }
          
      }
      EmailFetch();
      //console.log('Email Fetch func: '+famemail);
  }, [])  
  
    
    //fetch coords
    
    const FamilyLocationFetch= async()=>
    {    
      const path2 = "AppUsers/"+famemail;
      const docRef2 = doc(firestore,path2);
      //console.log('Loc Fetch func: '+famemail);
      const docSnap = await getDoc(docRef2);
        if (docSnap.exists()) {
          setLat ( parseFloat(docSnap.data().latitude));
          setLong ( parseFloat(docSnap.data().longitude)); 
          setMarkerlat(mylat);
          setMarkerlong(mylong);
          setFamlat(parseFloat(docSnap.data().latitude));
          setFamlong(parseFloat(docSnap.data().longitude));
          setFamname (docSnap.data().name.split(" ")[0]);
        } else {
          console.log("No such coords!");
        }
    }

    const MyLocationFetch= async()=>
    {    
      const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLat ( parseFloat(docSnap.data().latitude));
          setLong ( parseFloat(docSnap.data().longitude));
          setMarkerlat(parseFloat(docSnap.data().latitude));
          setMarkerlong(parseFloat(docSnap.data().longitude)); 
          setMylat ( parseFloat(docSnap.data().latitude));
          setMylong ( parseFloat(docSnap.data().longitude)); 
          setFamname(docSnap.data().name.split(" ")[0])
        } else {
          console.log("No such coords!");
        }
    }





    const distance = (lat1, lon1, lat2, lon2, unit) => {
      var radlat1 = Math.PI * lat1/180
      var radlat2 = Math.PI * lat2/180
      var theta = lon1-lon2
      var radtheta = Math.PI * theta/180
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist)
      dist = dist * 180/Math.PI
      dist = dist * 60 * 1.1515
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist
    }
  
    const findNearest = () => {
      var data = [{
        "code": "0001",
        "lat": "22.50376568739723",
        "lng": "88.3676901",
        "location": "Jadavpur Police Station"
      }, {
        "code": "0002",
        "lat": "22.484932581873178",
        "lng": "88.38930377243166",
        "location": "Survey Park Police Station"
      }, {
        "code": "0003",
        "lat": "22.476446595881963",
        "lng": "88.39582690480103",
        "location": "Panchasayar Police Station"
      },
      {
        "code": "0004",
        "lat": "22.476198514896655",
        "lng": "88.39589061504577",
        "location": "Panchasayar Police Station"
      },
      {
        "code": "0005",
        "lat": "22.49301139475855",
        "lng": "88.40043964156652",
        "location": "Purba Jadavpur Police Station"
      },
      {
        "code": "0006",
        "lat": "22.47493756501939",
        "lng": "88.35751204697763",
        "location": "Haridevpur Police Station"
      },
      {
        "code": "0007",
        "lat": "22.47497722080109",
        "lng": "88.35716872422135",
        "location": "Bansdhroni Police Station"
      },
    ]; 

      let minDist = distance(mylat, mylong, data[0].lat, data[0].lng, "K");
      let minLocation = data[0].location;
      let minLat = data[0].lat;
      let minLong = data[0].lng;
      let minName = data[0].location;
      for (var i = 0; i < data.length; i++) {
        let dist = distance(mylat, mylong, data[i].lat, data[i].lng, "K");  
        if ( dist < minDist) {
              minDist = dist;
              minLocation = data[i].location;
              minLat = data[i].lat;
              minLong = data[i].lng;
              minName = data[i].location;
        }
    }
    setLat(parseFloat(minLat));
    setLong(parseFloat(minLong));
    setFamname(minName);
    setMarkerlat(mylat);
    setMarkerlong(mylong);
    //console.log(minLocation);
  }

  const findNearestToFam = () => {
    var data = [{
      "code": "0001",
      "lat": "22.50376568739723",
      "lng": "88.3676901",
      "location": "Jadavpur Police Station"
    }, {
      "code": "0002",
      "lat": "22.484932581873178",
      "lng": "88.38930377243166",
      "location": "Survey Park Police Station"
    }, {
      "code": "0003",
      "lat": "22.476446595881963",
      "lng": "88.39582690480103",
      "location": "Panchasayar Police Station"
    },
    {
      "code": "0004",
      "lat": "22.476198514896655",
      "lng": "88.39589061504577",
      "location": "Panchasayar Police Station"
    },
    {
      "code": "0005",
      "lat": "22.49301139475855",
      "lng": "88.40043964156652",
      "location": "Purba Jadavpur Police Station"
    },
    {
      "code": "0006",
      "lat": "22.47493756501939",
      "lng": "88.35751204697763",
      "location": "Haridevpur Police Station"
    },
    {
      "code": "0007",
      "lat": "22.47497722080109",
      "lng": "88.35716872422135",
      "location": "Bansdhroni Police Station"
    },
  ]; 

    let minDist = distance(mylat, mylong, data[0].lat, data[0].lng, "K");
    let minLocation = data[0].location;
    let minLat = data[0].lat;
    let minLong = data[0].lng;
    let minName = data[0].location;
    for (var i = 0; i < data.length; i++) {
      let dist = distance(famlat, famlong, data[i].lat, data[i].lng, "K");  
      if ( dist < minDist) {
            minDist = dist;
            minLocation = data[i].location;
            minLat = data[i].lat;
            minLong = data[i].lng;
            minName = data[i].location;
      }
  }
  setLat(parseFloat(minLat));
  setLong(parseFloat(minLong));
  setMarkerlat(famlat)
  setMarkerlong(famlong)
  setFamname(minName);
  //console.log(minLocation);
}




    return (   
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Map</Text>
        </View>
        <MapView 
            style={styles.map} 
            initialRegion={{
              latitude: lat,
              longitude:  long,
              latitudeDelta: latdel,
              longitudeDelta: longdel,
            }} 
            onMapReady={MyLocationFetch}
            provider= {PROVIDER_GOOGLE}
            region={{
              latitude:  lat,
              longitude:  long,
              latitudeDelta: latdel,
              longitudeDelta: longdel,
            }}
            loadingEnabled={true}
            loadingBackgroundColor={"#495371"}
            showsUserLocation={true}
            zoomControlEnabled={true}
        >    
             <Marker 
                key='marker1' 
                coordinate={{latitude:  lat, longitude: long}}
                identifier={'mk1'}
        
                
              >
                <Image 
                  source={require("../assets/pin.png")}
                  style={styles.markerImage}
                  />
              
             </Marker>
             <Marker 
                key='marker2' 
                coordinate={{latitude:  markerlat, longitude: markerlong}}
                identifier={'mk2'}
        
                >
                <Image 
                  source={require("../assets/user.png")}
                  style={styles.markerImage}
                  />
              
             </Marker>
              <Polyline
              coordinates={[
                { latitude: lat, longitude: long },
                { latitude: markerlat, longitude: markerlong },
              ]} 
              strokeWidth= {3}
              strokeColor='brown'
              />      
        </MapView>

        <View style={styles.textContainer}>
          <Text style={{color:'white', fontWeight:'bold', fontSize:20, padding:1}}>{famname}</Text>
        </View>
        <View style={styles.bts}>
          <View style={styles.buttonContainer}>
            <Pressable
                style={[styles.button]}
                onPress={MyLocationFetch}
                android_ripple={{color: 'white', borderless: false}}>
                <Text style={styles.buttonText}>You</Text>
            </Pressable>
            <Pressable
                style={[styles.button]}
                onPress={FamilyLocationFetch}
                android_ripple={{color: 'white', borderless: false}}>
                <Text style={styles.buttonText}>Family</Text>
            </Pressable>
            <Pressable
                style={[styles.button]}
                onPress={findNearest}
                android_ripple={{color: 'white', borderless: false}}>
                <Text style={styles.buttonText}>Police 1</Text>
            </Pressable>
            <Pressable
                style={[styles.button]}
                onPress={findNearestToFam}
                android_ripple={{color: 'white', borderless: false}}>
                <Text style={styles.buttonText}>Police 2</Text>
            </Pressable>
          </View>
        </View> 
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#495371',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom:50,
  },
  headerText:{
   fontSize:30, textAlign: 'center', color:'white', fontWeight:"bold",
  },
  header:{
    flex:1.2, alignItems: 'center', justifyContent: 'flex-end', marginBottom:10,
  },
  map: {
    flex: 11,
    width: Dimensions.get('window').width,
    position:'relative',
  },
  textContainer:{
    fontSize:30, marginTop:0,justifyContent:'center', alignContent:'center',
  },
  bts:{
    flex:1, fontSize:30, marginTop:0, flexDirection:'row', justifyContent:'center', alignContent:'center',
  },
  buttonContainer:{
    flex:2.3, fontSize:30, marginTop:0, flexDirection:'row', justifyContent:'center', alignContent:'center',
  },
  buttonContainer2:{
    flex:1, marginTop:0, flexDirection:'row', justifyContent:'center', alignContent:'center',
  },
  button: {
    flex:1,
    padding: 10,
    elevation: 2, 
    backgroundColor: "teal",
    margin: 10,
    height:40,
    width:150,
  },
  button2: {
    flex:1,
    borderRadius: 20,
    padding: 10,
    elevation: 5, 
    backgroundColor: "teal",
    margin: 10,
    
  },
  buttonText:{
    textAlign: 'center', color:'white', fontWeight:"bold",
  },
  markerImage:{
    width:43,
    height:43,
  }
});

export default MapDB;