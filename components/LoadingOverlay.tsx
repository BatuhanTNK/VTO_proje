import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing } from '../constants/theme';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  progress?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Processing...',
  progress,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
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
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim, pulseAnim]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.container}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </Animated.View>
        <Text style={styles.message}>{message}</Text>
        {progress && <Text style={styles.progress}>{progress}</Text>}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.xl,
    alignItems: 'center',
    minWidth: 200,
  },
  message: {
    color: Colors.text,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  progress: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});
