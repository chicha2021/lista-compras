import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import AppNavigator from './src/navigation';
import { registerUser } from './src/utils/auth';

LogBox.ignoreLogs([
  'expo-notifications',
  'expo-notifications: Android Push',
  '`expo-notifications` functionality',
]);

export default function App() {
  useEffect(() => {
    registerUser('test', '1234');
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppNavigator />
    </NavigationContainer>
  );
}
