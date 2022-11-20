import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LocDB from '../screens/LocDB';
import MapDB from '../screens/MapDB';
import {View, Image, StyleSheet} from 'react-native';


const Tab = createBottomTabNavigator();
const Tabs = () => {
    return(
        <Tab.Navigator         
        screenOptions={{
            headerShown:false, 
            tabBarShowLabel: false,
            tabBarStyle:styles.bottomTab,
        }}>
        <Tab.Screen name={"User"} component={LocDB} options={{
            tabBarIcon: ({focused}) => (
                <View>
                    <Image
                        style={styles.logo}
                        source={require('../assets/home.png')}
                    />
                </View>
            )
        }}/>
        
        <Tab.Screen name={"Family"} component={MapDB}  options={{
            tabBarIcon: ({focused}) => (
                <View>
                    <Image
                        style={styles.logo}
                        source={require('../assets/map.png')}
                    />
                </View>
            )
        }}/>
        </Tab.Navigator>
        
        
    ); 
}
export default Tabs;


const styles = StyleSheet.create({
    bottomTab: {
        position: 'absolute' ,
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 0,
        borderRadius: 0,
        height: 50,
        backgroundColor:'white',
    },
    text: {
        color: 'teal',
        fontSize:15,
    },
    logo:{
        
        alignItems:'center',
        justifyContent:'center',
        height:20,
        width:20,
    },
})

