import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { ErrorAlert } from '@/components/ErrorAlert';
import { useTryOn } from '@/context/TryOnContext';
import { ApiService } from '@/services/api';
import { HistoryService } from '@/services/historyService'; 
import {
  Colors,
  Gradients,
  BorderRadius,
  FontSizes,
  FontWeights,
  Spacing,
} from '@/constants/theme';
import { TryOnResult } from '@/types'; // Bu import'un da aktif olduğundan emin olun

// expo-file-system import'u
import * as FileSystem from 'expo-file-system/legacy';

export default function ProcessingScreen() {
  const router = useRouter();
  const { selectedPersonImage, selectedGarmentImage, setCurrentResult, setError, error } =
    useTryOn();
  const [progress, setProgress] = useState('Initializing...');
  const [showError, setShowError] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Animasyon useEffect'leri (değişiklik yok)
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 3000, useNativeDriver: true })
    ).start();
  }, [pulseAnim, rotateAnim]);

  useEffect(() => {
    if (!selectedPersonImage || !selectedGarmentImage) {
      router.replace('/select-images');
      return;
    }
    processTryOn();
  }, []);

  //base64 dönüştürme
  const getSafeImageUri = async (uri: string): Promise<string> => {
    if (uri.startsWith('http')) {
      return uri;
    }
    if (uri.startsWith('file://')) {
      try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: 'base64',
        });
        const format = uri.endsWith('.png') ? 'png' : 'jpeg';
        return `data:image/${format};base64,${base64}`;
      } catch (e) {
        console.error("Failed to read file as Base64", e);
        throw new Error("Failed to process local image file.");
      }
    }
    return uri;
  };

  
  const processTryOn = async () => {
    if (!selectedPersonImage || !selectedGarmentImage) return;

    try {
      setProgress('Preparing images...');
      
      const personImageUri = await getSafeImageUri(selectedPersonImage.uri);
      const garmentImageUri = await getSafeImageUri(selectedGarmentImage.uri);

      if (isCancelled) return;
      
      setProgress('Sending to AI...');

      const response = await ApiService.processTryOn({
        personImageUrl: personImageUri,
        garmentImageUrl: garmentImageUri,
      });

      if (isCancelled) return;

      if (response.success && response.resultImageUrl) {
        // --- SUPABASE KAYDETME KODU YENİDEN AKTİF EDİLDİ ---
        setProgress('Saving results...'); // Mesajı "Saving" olarak güncelledik

        // Supabase'i çağıran satırları geri ekliyoruz:
        const savedResult = await HistoryService.saveToHistory({
          personImageUrl: selectedPersonImage.uri,
          garmentImageUrl: selectedGarmentImage.uri,
          resultImageUrl: response.resultImageUrl,
        });

        // Kontrolü geri ekliyoruz
        if (savedResult) { 
          setCurrentResult(savedResult);
        } else {
          // Kaydetme başarısız olsa bile (yeni bir hata olursa diye) sonucu yine de göster
          console.warn("Failed to save to history, but proceeding to result.");
          setCurrentResult({
              id: `temp-${Date.now()}`,
              personImageUrl: selectedPersonImage.uri,
              garmentImageUrl: selectedGarmentImage.uri,
              resultImageUrl: response.resultImageUrl,
              createdAt: new Date().toISOString(),
              isFavorite: false,
          });
        }
        // --- DEĞİŞİKLİK BİTTİ ---

        setProgress('Complete!');
        await new Promise((resolve) => setTimeout(resolve, 500));
        router.replace('/result');
      } else {
        setError(response.error || 'Failed to process try-on');
        setShowError(true);
      }
    } catch (err) {
      if (isCancelled) return;
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Processing error:', err);
      setError(errorMessage);
      setShowError(true);
    }
  };

  // Kalan fonksiyonlar (değişiklik yok)
  const handleCancel = () => {
    setIsCancelled(true);
    router.back();
  };

  const handleRetry = () => {
    setShowError(false);
    setError(null);
    setIsCancelled(false);
    processTryOn();
  };

  const handleDismissError = () => {
    setShowError(false);
    router.back();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // return (JSX) kısmı (değişiklik yok)
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient colors={Gradients.background} style={styles.gradient}>
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: pulseAnim }, { rotate: spin }],
              },
            ]}
          >
            <Sparkles size={64} color={Colors.primary} />
          </Animated.View>

          <Text style={styles.title}>AI is trying on your outfit</Text>
          <Text style={styles.progress}>{progress}</Text>
          <Text style={styles.hint}>This usually takes 15-30 seconds</Text>

          <View style={styles.imagesContainer}>
            {selectedPersonImage && (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: selectedPersonImage.uri }} style={styles.image} />
                <Text style={styles.imageLabel}>Person</Text>
              </View>
            )}
            {selectedGarmentImage && (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: selectedGarmentImage.uri }} style={styles.image} />
                <Text style={styles.imageLabel}>Garment</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Cancel"
            onPress={handleCancel}
            variant="outline"
            fullWidth
          />
        </View>
      </LinearGradient>

      <ErrorAlert
        visible={showError}
        message={error || 'An error occurred'}
        onDismiss={handleDismissError}
        onRetry={handleRetry}
      />
    </SafeAreaView>
  );
}

// Stiller (değişiklik yok)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  progress: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  hint: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  imagesContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  imageWrapper: {
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 150,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
  },
  imageLabel: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  footer: {
    padding: Spacing.lg,
  },
});