import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar'; 
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { TryOnProvider } from '@/context/TryOnContext';
import 'react-native-url-polyfill/auto';


import { Platform } from 'react-native';

import * as NavigationBar from 'expo-navigation-bar'; 


export default function RootLayout() {
  useFrameworkReady();

  
  useEffect(() => {
    if (Platform.OS === 'android') {
      
      NavigationBar.setVisibilityAsync('hidden');
      
     
    }
  }, []); 
 

  return (
    <TryOnProvider>
      
      {}
      <StatusBar hidden />
      
      {}
      <Stack screenOptions={{ 
          headerShown: false,
          autoHideHomeIndicator: true 
      }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="select-images" />
        <Stack.Screen name="processing" />
        <Stack.Screen name="result" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </TryOnProvider>
  );
}