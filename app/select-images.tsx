import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Shirt, X, Plus } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { ImagePickerModal } from '@/components/ImagePickerModal';
import { useTryOn } from '@/context/TryOnContext';
import {
  Colors,
  Gradients,
  BorderRadius,
  FontSizes,
  FontWeights,
  Spacing,
  Shadows,
  Layout,
} from '@/constants/theme';
import { ImageSource } from '@/types';

export default function SelectImagesScreen() {
  const router = useRouter();
  const { selectedPersonImage, selectedGarmentImage, setSelectedPersonImage, setSelectedGarmentImage } =
    useTryOn();
  const [showPersonPicker, setShowPersonPicker] = useState(false);
  const [showGarmentPicker, setShowGarmentPicker] = useState(false);

  const canProceed = selectedPersonImage && selectedGarmentImage;

  const handlePersonImageSelected = (image: ImageSource) => {
    setSelectedPersonImage(image);
  };

  const handleGarmentImageSelected = (image: ImageSource) => {
    setSelectedGarmentImage(image);
  };

  const handleClearPerson = () => {
    setSelectedPersonImage(null);
  };

  const handleClearGarment = () => {
    setSelectedGarmentImage(null);
  };

  const handleContinue = () => {
    if (canProceed) {
      router.push('/processing');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={Gradients.background} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Images</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Person Image</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Select a photo of yourself or the person who will try on the outfit
            </Text>

            {selectedPersonImage ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: selectedPersonImage.uri }} style={styles.previewImage} />
                <TouchableOpacity style={styles.removeButton} onPress={handleClearPerson}>
                  <X size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadBox}
                onPress={() => setShowPersonPicker(true)}
              >
                <View style={styles.uploadIcon}>
                  <User size={48} color={Colors.textMuted} />
                </View>
                <Text style={styles.uploadText}>Tap to select person image</Text>
                <Text style={styles.uploadHint}>Camera, Gallery, or URL</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shirt size={24} color={Colors.secondary} />
              <Text style={styles.sectionTitle}>Garment Image</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Select a photo of the clothing item you want to try on
            </Text>

            {selectedGarmentImage ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: selectedGarmentImage.uri }} style={styles.previewImage} />
                <TouchableOpacity style={styles.removeButton} onPress={handleClearGarment}>
                  <X size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadBox}
                onPress={() => setShowGarmentPicker(true)}
              >
                <View style={styles.uploadIcon}>
                  <Shirt size={48} color={Colors.textMuted} />
                </View>
                <Text style={styles.uploadText}>Tap to select garment image</Text>
                <Text style={styles.uploadHint}>Camera, Gallery, or URL</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>Tips for Best Results</Text>
            <Text style={styles.tipText}>• Use clear, well-lit photos</Text>
            <Text style={styles.tipText}>• Person should be facing forward</Text>
            <Text style={styles.tipText}>• Garment should be clearly visible</Text>
            <Text style={styles.tipText}>• Avoid busy backgrounds</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Generate Try-On"
            onPress={handleContinue}
            disabled={!canProceed}
            fullWidth
            size="large"
          />
        </View>
      </LinearGradient>

      <ImagePickerModal
        visible={showPersonPicker}
        onClose={() => setShowPersonPicker(false)}
        onImageSelected={handlePersonImageSelected}
        title="Select Person Image"
      />

      <ImagePickerModal
        visible={showGarmentPicker}
        onClose={() => setShowGarmentPicker(false)}
        onImageSelected={handleGarmentImageSelected}
        title="Select Garment Image"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  sectionDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  uploadBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  uploadIcon: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  uploadText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  uploadHint: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  imagePreview: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.md,
  },
  previewImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  tipBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    padding: Spacing.lg,
  },
  tipTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  tipText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
});
