import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, Link, X } from 'lucide-react-native';
import { Colors, BorderRadius, FontSizes, FontWeights, Spacing, Shadows } from '../constants/theme';
import { Button } from './Button';
import { ImageSource } from '../types';

interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (image: ImageSource) => void;
  title: string;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  visible,
  onClose,
  onImageSelected,
  title,
}) => {
  const [urlInput, setUrlInput] = useState('');

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Camera permission is required to take photos. Please enable it in your device settings.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Gallery access is required to select photos. Please enable it in your device settings.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const handleCamera = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Camera is not available on web platform');
      return;
    }

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected({
        uri: result.assets[0].uri,
        type: 'camera',
      });
      onClose();
      setUrlInput('');
    }
  };

  const handleGallery = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected({
        uri: result.assets[0].uri,
        type: 'gallery',
      });
      onClose();
      setUrlInput('');
    }
  };

  const handleUrlSubmit = () => {
    const trimmedUrl = urlInput.trim();
    if (!trimmedUrl) {
      Alert.alert('Invalid URL', 'Please enter a valid image URL');
      return;
    }

    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(trimmedUrl)) {
      Alert.alert('Invalid URL', 'Please enter a valid HTTP or HTTPS URL');
      return;
    }

    onImageSelected({
      uri: trimmedUrl,
      type: 'url',
    });
    onClose();
    setUrlInput('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            {Platform.OS !== 'web' && (
              <TouchableOpacity style={styles.option} onPress={handleCamera}>
                <View style={styles.iconContainer}>
                  <Camera size={32} color={Colors.primary} />
                </View>
                <Text style={styles.optionText}>Camera</Text>
                <Text style={styles.optionDescription}>Take a photo</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.option} onPress={handleGallery}>
              <View style={styles.iconContainer}>
                <ImageIcon size={32} color={Colors.secondary} />
              </View>
              <Text style={styles.optionText}>Gallery</Text>
              <Text style={styles.optionDescription}>Choose from library</Text>
            </TouchableOpacity>

            <View style={styles.urlContainer}>
              <View style={styles.iconContainer}>
                <Link size={32} color={Colors.primary} />
              </View>
              <Text style={styles.optionText}>Image URL</Text>
              <TextInput
                style={styles.input}
                placeholder="https://example.com/image.jpg"
                placeholderTextColor={Colors.textMuted}
                value={urlInput}
                onChangeText={setUrlInput}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
              <Button
                title="Use URL"
                onPress={handleUrlSubmit}
                disabled={!urlInput.trim()}
                fullWidth
              />
            </View>
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
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  option: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: Spacing.sm,
  },
  optionText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  optionDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  urlContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
