import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation'
import {AuthProvider} from './src/contexts/authContext';
import React from 'react'

export  default function App () {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  )
}
