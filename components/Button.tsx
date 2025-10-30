import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, FontSizes, FontWeights, Spacing, Shadows } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
}) => {
  const handlePress = () => {
    if (!disabled && !loading) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress();
    }
  };

  const getButtonContent = () => (
    <>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? Colors.primary : Colors.white} />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, textStyles[variant], sizeTextStyles[size], textStyle]}>
            {title}
          </Text>
        </>
      )}
    </>
  );

  const buttonStyle = [
    styles.button,
    sizeStyles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={buttonStyle}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, sizeStyles[size]]}
        >
          {getButtonContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[buttonStyle, variantStyles[variant]]}
    >
      {getButtonContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  text: {
    fontWeight: FontWeights.semibold,
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
});

// --- DEĞİŞİKLİK BU BÖLÜMDE YAPILDI ---
// Butonların sığabilmesi için sabit 'height' değerleri kaldırıldı.
// Yükseklik artık sadece 'paddingVertical' ile belirlenecek.

const sizeStyles = StyleSheet.create({
  small: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    // height: 40, // <-- KALDIRILDI
  },
  medium: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    // height: 56, // <-- KALDIRILDI
  },
  large: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    // height: 64, // <-- KALDIRILDI
  },
});
// --- DEĞİŞİKLİK BİTTİ ---

const textStyles = StyleSheet.create({
  primary: {
    color: Colors.white,
  },
  secondary: {
    color: Colors.white,
  },
  outline: {
    color: Colors.primary,
  },
  ghost: {
    color: Colors.text,
  },
});

const sizeTextStyles = StyleSheet.create({
  small: {
    fontSize: FontSizes.sm,
  },
  medium: {
    fontSize: FontSizes.md,
  },
  large: {
    fontSize: FontSizes.lg,
  },
});