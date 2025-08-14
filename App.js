import React, { useState, useEffect } from 'react';


import AppNavigator, { AuthContext } from './src/navigation/AppNavigator';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import Config from 'react-native-config';
import mqtt from 'mqtt';
 

import { Alert } from 'react-native';
/*import notifee from '@notifee/react-native'; // Add this import if using notifee
import BackgroundFetch  from 'react-native-background-fetch';
*/
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  /*
    const initBackgroundFetch = async () => {
      try {
        const onEvent = async (taskId) => {
          console.log('[BackgroundFetch] task: ', taskId);
          // Do your background work here...
          BackgroundFetch.finish(taskId);
        };
  
        const onTimeout = async (taskId) => {
          console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
          BackgroundFetch.finish(taskId);
        };
  
        let status = await BackgroundFetch.configure(
          { minimumFetchInterval: 15 },
          onEvent,
          onTimeout
        );
  
        console.log('[BackgroundFetch] configure status: ', status);
      } catch (error) {
        console.error('[BackgroundFetch] configure error:', error);
      }
    };
    */

  useEffect(() => {
    // initBackgroundFetch();

  }, []);

  async function showNotification(title, body) {
    await notifee.requestPermission();

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'default',
      },
    });
  }

  return (
    <PaperProvider>
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <AppNavigator />
      </AuthContext.Provider>
    </PaperProvider>
  );

}