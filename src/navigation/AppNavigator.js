import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";


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

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export const AuthContext = React.createContext();

const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <AuthStack.Screen name="Register" component={RegisterScreen}  options={{ headerShown: false }}/>
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }}/>
  </AuthStack.Navigator>
);



const DashboardStack = () => {
  const { setUserToken } = useContext(AuthContext); // 🔑

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
          title: 'Dashboard',
          headerLeft: () => (
            <FontAwesome6
              icon="bars"
              size={25}
              color="black"
              style={{ marginLeft: 20 }}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
          headerRight: () => (
            <>
              <FontAwesome6
                name="qrcode"
                size={25}
                color="black" 
                onPress={() => navigation.navigate('BarcodeScanner')}
              /> 
            </>
          ),
        })}
      />
      <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} />
      <Stack.Screen name="WifiSettings" component={WifiSettingsScreen} />
      <Stack.Screen name="WifiScanner" component={WifiScannerScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="ManuelSetting" component={ManuelSetting} />
      <Stack.Screen name="PlantBigView" component={PlantBigView} title="Bitki Özellikleri" />

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
          <FontAwesome6 name="server" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome6 name="id-card" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);
const DrawerNavigator = () => (
  <Drawer.Navigator screenOptions={{ headerShown: false }}>
    <Drawer.Screen
      name="Dashboard"
      component={DashboardStack}
      options={{
        drawerIcon: ({ color, size }) => (
          <FontAwesome6 name="house" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        drawerIcon: ({ color, size }) => (
          <FontAwesome6 name="gears" size={size} color={color} />
        ),
      }}
    />
  </Drawer.Navigator>
);

export default function AppNavigator() {


  const [userToken, setUserToken] = useState(null);

  useEffect(() => {


    console.log("LoginScreen:", LoginScreen); // undefined mı?
    console.log("DrawerNavigator:", DrawerNavigator);

    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setUserToken(user.uid);
      } else {
        setUserToken(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ setUserToken }}>
      <NavigationContainer>
        {userToken == null ? <AuthStackScreen /> : <DrawerNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
