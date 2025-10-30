import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';
import { Colors, BorderRadius, FontSizes, FontWeights, Spacing, Shadows } from '../constants/theme';
import { Button } from './Button';

interface ErrorAlertProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  visible,
  message,
  onDismiss,
  onRetry,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
            <X size={24} color={Colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <AlertCircle size={48} color={Colors.error} />
          </View>

          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {onRetry && (
              <Button
                title="Retry"
                onPress={() => {
                  onDismiss();
                  onRetry();
                }}
                style={styles.button}
              />
            )}
            <Button
              title="Dismiss"
              onPress={onDismiss}
              variant="outline"
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...Shadows.lg,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    padding: Spacing.sm,
    zIndex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: Spacing.sm,
  },
  button: {
    width: '100%',
  },
});
