import React from 'react';
import { StyleSheet, View, Image, Text, StatusBar } from 'react-native';
import icon from '../../assets/icon.png';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar
        backgroundColor="#ece0e0ff" // Android
        barStyle="dark-content"     // text color
        translucent={false}
      />

      <Image source={icon} style={styles.image} />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ece0e0ff',
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  text: {
    color: '#555', // adjusted for visibility on light background
    fontSize: 16,
    opacity: 0.7,
  },
});
