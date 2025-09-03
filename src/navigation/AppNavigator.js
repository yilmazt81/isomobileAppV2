import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
//import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

import LoginScreen from '../screens/Login/LoginScreen';
import RegisterScreen from '../screens/SignupScreen/SignupScreen';

import HomeScreen from '../screens/Main/index';
import ProfileScreen from '../screens/ProfileScreen/index';

import SettingsScreen from '../screens/SettingsScreen'; // yeni ekran
import BarcodeScannerScreen from '../screens/BarcodeScanner/BarcodeScannerScreen'; // yeni ekran
import WifiSettingsScreen from '../screens/WifiSettings/WifiSettingsScreen'; // yeni ekran
import auth from '@react-native-firebase/auth';
import WifiScannerScreen from '../screens/WifiScanner/WifiScannerScreen'; // yeni ekran
import PlantBigView from '../screens/Devicescreen/Plantvase/PlantBigView'; // yeni ekran
import ManuelSetting from '../screens/ManuelSetting/ManuelSettingScreen'; // yeni ekran
import ForgotPasswordScreen from '../screens/ForgotPassword/forgotPasswordScreen';
import PlantBigViewPomp from '../screens/Devicescreen/PlantWater2Pomp/PlantBigViewPomp';
import { useTranslation } from 'react-i18next'; 


const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
//const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export const AuthContext = React.createContext();

const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <AuthStack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
  </AuthStack.Navigator>
);



const DashboardStack = () => {
  const { setUserToken } = useContext(AuthContext); // 🔑
  const { t, i18n } = useTranslation();

  const logout = () => {
    auth()
      .signOut()
      .then(() => {
        setUserToken(null);
      });
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DashboardTabs"
        component={TabNavigator}
        options={({ navigation }) => ({
          title: t("Dashboard"),
         /* headerLeft: () => (
            <MaterialDesignIcons
              name="menu"
              size={25}
              color="black"
              style={{ marginLeft: 20 }}
              onPress={() => navigation.toggleDrawer()}
            />
          ),*/
          headerRight: () => (
            <>
              <MaterialDesignIcons
                name="qrcode"
                size={25}
                color="black"
                style={{ marginLeft: 20 }}
                onPress={() => navigation.navigate('BarcodeScanner')}
              />
              <MaterialDesignIcons name='logout'
                size={25}
                color="black"
                style={{ marginLeft: 20 }}
                onPress={logout} />
            </>
          ),
        })}
      />
      <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen}   options={() => ({ title: t("BarcodeScanner") })}  />
      <Stack.Screen name="WifiSettings" component={WifiSettingsScreen}   options={() => ({ title: t("WifiSettingsWifiSettings_Header") })} />
      <Stack.Screen name="WifiScanner" component={WifiScannerScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="ManuelSetting" component={ManuelSetting} 
      options={() => ({ title: t("ManuelSetting") })} 
      />
      <Stack.Screen name="PlantBigView" component={PlantBigView}   options={() => ({ title: t("PlantBigViewSetting") })}   />
      <Stack.Screen name='PlantBigViewPomp' options={() => ({ title: t("MultipompSettings") })} 
      
      component={PlantBigViewPomp}></Stack.Screen>
      <Stack.Screen name='Home' component={HomeScreen}></Stack.Screen>
    </Stack.Navigator>
  );
};

const TabNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialDesignIcons name="devices" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialDesignIcons name="face-woman-profile" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);
/*
const DrawerNavigator = () => (
  <Drawer.Navigator screenOptions={{ headerShown: false }}>
    <Drawer.Screen
      name="Dashboard"
      component={DashboardStack}
      options={{
        drawerIcon: ({ color, size }) => (
          <MaterialDesignIcons name="house" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        drawerIcon: ({ color, size }) => (
          <MaterialDesignIcons name="cog" size={size} color={color} />
        ),
      }}
    />
  </Drawer.Navigator>
);
*/

export default function AppNavigator() {


  const [userToken, setUserToken] = useState(null);

  useEffect(() => {

    try {
      const unsubscribe = auth().onAuthStateChanged(user => {
        if (user) {
          setUserToken(user.uid);
        } else {
          setUserToken(null);
        }
      });

      return unsubscribe;
    } catch (error) {
     // crashlytics().recordError(error);
      console.log(error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ setUserToken }}>
         <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {userToken == null ? <AuthStackScreen /> : <DashboardStack />}
      </NavigationContainer></GestureHandlerRootView>
    </AuthContext.Provider>
  );
}
