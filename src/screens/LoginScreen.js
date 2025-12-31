{/*import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Pressable, Image} from 'react-native';
import {AuthContext} from '../contexts/AuthContext';
import logo from '../../assets/logo.png';

export default function LoginScreen({ navigation}){
    const {login} = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async () =>
    {
      setLoading(true);

      try {

        await login(email,password);
        
      } catch (err) {
        Alert.alert('Login Failed', err.response?.data?.message || err.message );
      }finally{
        setLoading(false);
      }

    }    
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="jsmith@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input}/>
      
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input}/>

      <Pressable onPress={submit} style={({pressed}) => [styles.button, {backgroundColor: pressed ? '#0055aa':'#007bff'},]} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Logging in...': 'Login'}</Text>
      </Pressable>

      <Pressable onPress={()=>navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </Pressable>
      <Pressable onPress={()=> navigation.navigate('ResetPassword')}>
        <Text style={styles.link}>Forgot password?</Text>
      </Pressable>    
      
    </View>
  );


}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  button: {
    padding: 14,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 12,

  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#007bff', textAlign: 'center', marginTop: 8 },
  logo: {marginLeft: 50, width: 200, height: 200, resizeMode: 'center', marginBottom:40}
});*/}

import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Pressable,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import logo from '../../assets/logo.png';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      Alert.alert('Login Failed', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Login</Text>

            <TextInput
              placeholder="jsmith@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            <Pressable
              onPress={submit}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: pressed ? '#0055aa' : '#007bff' },
              ]}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Logging in...' : 'Login'}
              </Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Don't have an account? Register</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate('ResetPassword')}>
              <Text style={styles.link}>Forgot password?</Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    padding: 14,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 8,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'center',
    marginBottom: 40,
  },
});




