/*import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation'
import {AuthProvider} from './src/contexts/AuthContext';
import SplashScreen from './src/screens/SplashScreen';
import React, { useState } from 'react'

export  default function App () {

  const [appReady, setAppReady] = useState(false);

  if(!appReady){

    return <SplashScreen />
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  )
}*/

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation';
import { AuthProvider } from './src/contexts/AuthContext';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Simulate loading (auth check, assets, etc.)
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 2000); // 2 seconds splash

    return () => clearTimeout(timer);
  }, []);

  if (!appReady) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

