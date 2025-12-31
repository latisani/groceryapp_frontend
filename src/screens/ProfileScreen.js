/*import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import {AuthContext} from '../contexts/AuthContext';

export default function ProfileScreen() {
    const {user, logout} = useContext(AuthContext);
  return (
    <View style={{padding: 16}}>
        <Text>Name: {user?.fullname}</Text>
        <Text>Email: {user?.email}</Text>
        <Button title="Logout" onPress={logout}/>
    </View>
  );
}*/
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.info}>Loading user info...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Full Name:</Text>
      <Text style={styles.info}>{user.fullname || 'No name available'}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.info}>{user.email}</Text>

      <Button title="Logout" onPress={logout} color="#ff5555" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
});
