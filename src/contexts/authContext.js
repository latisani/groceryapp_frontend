import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const loadUser = async () => {
        const token = await AsyncStorage.getItem('token');
        const userJson = await AsyncStorage.getItem('user');
        if(token && userJson) setUser(JSON.parse(userJson));
        console.log(token);
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
    const res = await api.post('/auth/register', { fullname, email, password });

    const token = res.data?.token;
    const user = res.data?.user;

    if (!token) {
        console.warn('No token received during registration');
        return res;
    }

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    setUser(user);

    return res;
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setUser(null);
    }


  return (
    <AuthContext.Provider value={{user, login, register, logout}}>
        {children}
    </AuthContext.Provider>
  )
}
