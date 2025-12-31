import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MonthScreen from '../screens/MonthScreen';
import ItemListScreen from '../screens/ItemListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { AuthContext } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs(){
    return(
        <Tab.Navigator

                screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Dashboard') {
                    iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Months') {
                    iconName = focused ? 'calendar' : 'calendar-outline';
                } else if (route.name === 'Profile') {
                    iconName = focused ? 'person' : 'person-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007bff',
                tabBarInactiveTintColor: 'gray',
            })}
        
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Months" component={MonthScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default function RootNavigator(){
    const {user} = useContext(AuthContext);

    return(
        <Stack.Navigator screenOptions={{headerShown: true}}>
            {user ?(
                <>
                  <Stack.Screen name="Home" component={MainTabs} options={{headerShown: false}} />
                  <Stack.Screen name="Items" component={ItemListScreen} options={{ title: 'Items' }} />
                </>
            ):(
                <>
                  <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                  <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                </>)}
        </Stack.Navigator>
    );
}