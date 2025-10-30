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
// Hata verdiği için HistoryService'i artık burada kullanmıyoruz.
// import { HistoryService } from '@/services/historyService'; 
import {
  Colors,
  Gradients,
  BorderRadius,
  FontSizes,
  FontWeights,
  Spacing,
} from '@/constants/theme';
import { TryOnResult } from '@/types'; // TryOnResult tipini import etmemiz gerekebilir.

export default function ProcessingScreen() {
  const router = useRouter();
  const { selectedPersonImage, selectedGarmentImage, setCurrentResult, setError, error } =
    useTryOn();
  const [progress, setProgress] = useState('Initializing...');
  const [showError, setShowError] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, [pulseAnim, rotateAnim]);

  useEffect(() => {
    if (!selectedPersonImage || !selectedGarmentImage) {
      router.replace('/select-images');
      return;
    }

    processTryOn();
  }, []);

  const processTryOn = async () => {
    if (!selectedPersonImage || !selectedGarmentImage) return;

    try {
      setProgress('Preparing images...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress('Sending to AI...');

      const response = await ApiService.processTryOn({
        personImageUrl: selectedPersonImage.uri,
        garmentImageUrl: selectedGarmentImage.uri,
      });

      if (isCancelled) return;

      if (response.success && response.resultImageUrl) {
        
        // --- DEĞİŞİKLİK BURADA ---
        // Supabase kaydetme adımını atlıyoruz ve sonucu manuel oluşturuyoruz.
        
        setProgress('Finalizing result...'); // Mesajı güncelledik

        // const savedResult = await HistoryService.saveToHistory({ ... }); // BU SATIRI DEVRE DIŞI BIRAKTIK
        
        // Sonuç ekranının ihtiyacı olan 'currentResult' nesnesini manuel olarak oluşturalım:
        const newResult: TryOnResult = {
          id: `temp-${Date.now()}`, // Geçici bir ID veriyoruz
          personImageUrl: selectedPersonImage.uri,
          garmentImageUrl: selectedGarmentImage.uri,
          resultImageUrl: response.resultImageUrl,
          createdAt: new Date().toISOString(),
          isFavorite: false,
        };

        // 'if (savedResult)' kontrolünü kaldırıp 'setCurrentResult'i doğrudan çağırıyoruz:
        setCurrentResult(newResult);
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
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setShowError(true);
    }
  };

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

const styles = StyleSheet.create({
  // Stillerde değişiklik yok...
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