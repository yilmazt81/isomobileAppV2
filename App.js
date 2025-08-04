import React, { useState } from 'react';


import AppNavigator, { AuthContext } from './src/navigation/AppNavigator';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  return (
 
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <AppNavigator />
      </AuthContext.Provider>
   
  );

}