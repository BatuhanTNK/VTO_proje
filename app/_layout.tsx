import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar'; // Bunu zaten import etmişsiniz, harika
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { TryOnProvider } from '@/context/TryOnContext';
import 'react-native-url-polyfill/auto';

// --- YENİ VE DOĞRU IMPORTLAR ---
import { Platform } from 'react-native';
// 'expo-system-ui'ye artık gerek yok, 'expo-navigation-bar' yeterli
import * as NavigationBar from 'expo-navigation-bar'; 
// ---

export default function RootLayout() {
  useFrameworkReady();

  // --- DÜZELTİLMİŞ useEffect HOOK'U ---
  // Sadece Android'deki alt navigasyon çubuğu için
  useEffect(() => {
    if (Platform.OS === 'android') {
      // 1. Android'deki alttaki Navigasyon Çubuğunu gizle
      NavigationBar.setVisibilityAsync('hidden');
      
      // 2. Kullanıcı alttan yukarı kaydırdığında çubuğun geçici olarak gelmesini sağla
      NavigationBar.setBehaviorAsync('inset-swipe');
    }
  }, []); // Bu kod sadece 1 kez çalışacak
  // ---

  return (
    <TryOnProvider>
      
      {/* 1. Üstteki Status Bar'ı gizlemek için en doğru yol: */}
      <StatusBar hidden />
      
      {/* 2. iOS'taki Home Indicator'ı (alttaki çubuk) 
             otomatik gizlemek için en doğru yol: */}
      <Stack screenOptions={{ 
          headerShown: false,
          autoHideHomeIndicator: true // Bu satır iOS'taki çubuğu otomatik gizler
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