import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MonthScreen from '../screens/MonthScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { authContext } from '../contexts/authContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs(){
    return(
        <Tab.Navigator>
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Months" component={MonthScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default function RootNavigator(){
    const {user} = useContext(authContext);

    return(
        <Stack.Navigator screenOptions={{headerShown: true}}>
            {user ?(
                <>
                  <Stack.Screen name="Home" component={MainTabs} options={{headerShown: false}} />
                </>
            ):(
                <>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                  <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                </>)}
        </Stack.Navigator>
    )
}