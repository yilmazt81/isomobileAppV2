import React, { useState } from 'react';

import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import LoginScreen from './src/screens/Login/LoginScreen'; // Adjust the import path as necessary

import AppNavigator, { AuthContext } from './src/navigation/AppNavigator';
 

export default function App() {
   const [isLoggedIn, setIsLoggedIn] = useState(false);


 return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <AppNavigator />
    </AuthContext.Provider>
  );

}