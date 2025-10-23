import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'
import api from '../api';

export const authContext = createContext();

export const authProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const loadUser = async () => {
        const token = await AsyncStorage.getItem('token');
        const userJson = await AsyncStorage.getItem('user');
        if(token && userJson) setUser(JSON.parse(userJson));
    };

    useEffect(() =>{loadUser();},[]);

    const login = async (email, password)=>{
        const res = await api.post('/auth/login', {email, password});
        await AsyncStorage.setItem('token', res.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(res.data.user));

        setUser(res.data.user);

        return res;

    }

    const register = async (fullname, email, password) => {
        const res = await api.post('/auth/register',{fullname, email, password});
        await AsyncStorage.setItem('token', res.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);

        return res;
    }

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setUser(null);
    }


  return (
    <authContext.Provider value={{user, login, register, logout}}>
        {children}
    </authContext.Provider>
  )
}
