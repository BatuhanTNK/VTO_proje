import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, Download, Share2, Heart, Copy, Sparkles } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { Toast } from '@/components/Toast';
import { useTryOn } from '@/context/TryOnContext';
import {
  Colors,
  Gradients,
  BorderRadius,
  FontSizes,
  FontWeights,
  Spacing,
  Shadows,
} from '@/constants/theme';

const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width - Spacing.lg * 2;

export default function ResultScreen() {
  const router = useRouter();
  const { currentResult, toggleFavorite, loadFavorites, loadHistory } = useTryOn();
  const [activeView, setActiveView] = useState<'person' | 'garment' | 'result'>('result');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const scrollViewRef = useRef<ScrollView>(null);

  if (!currentResult) {
    router.replace('/');
    return null;
  }

  const handleToggleFavorite = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    await toggleFavorite(currentResult.id, !currentResult.isFavorite);
    await loadFavorites();
    await loadHistory();
    showToastMessage(
      currentResult.isFavorite ? 'Removed from favorites' : 'Added to favorites',
      'success'
    );
  };

  const handleDownload = async () => {
    try {
      showToastMessage('Download feature coming soon!', 'info');
    } catch (error) {
      console.error('Download error:', error);
      showToastMessage('Failed to save image', 'error');
    }
  };

  const handleShare = async () => {
    try {
      showToastMessage('Share feature coming soon!', 'info');
    } catch (error) {
      console.error('Share error:', error);
      showToastMessage('Failed to share image', 'error');
    }
  };

  const handleCopyUrl = () => {
    showToastMessage('URL copied to clipboard!', 'success');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleTryAnother = () => {
    router.push('/select-images');
  };

  const showToastMessage = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const getActiveImage = () => {
    switch (activeView) {
      case 'person':
        return currentResult.personImageUrl;
      case 'garment':
        return currentResult.garmentImageUrl;
      case 'result':
      default:
        return currentResult.resultImageUrl;
    }
  };

  const getActiveLabel = () => {
    switch (activeView) {
      case 'person':
        return 'Original Person';
      case 'garment':
        return 'Selected Garment';
      case 'result':
      default:
        return 'Virtual Try-On Result';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={Gradients.background} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Sparkles size={20} color={Colors.primary} />
            <Text style={styles.headerTitle}>Result</Text>
          </View>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.headerButton}>
            <Heart
              size={24}
              color={currentResult.isFavorite ? Colors.error : Colors.text}
              fill={currentResult.isFavorite ? Colors.error : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.imageLabel}>{getActiveLabel()}</Text>
            </View>
            <Image source={{ uri: getActiveImage() }} style={styles.mainImage} />
          </View>

          <View style={styles.viewSelector}>
            <TouchableOpacity
              style={[styles.viewButton, activeView === 'person' && styles.viewButtonActive]}
              onPress={() => setActiveView('person')}
            >
              <Image
                source={{ uri: currentResult.personImageUrl }}
                style={styles.thumbnailImage}
              />
              <Text
                style={[
                  styles.viewButtonText,
                  activeView === 'person' && styles.viewButtonTextActive,
                ]}
              >
                Person
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.viewButton, activeView === 'garment' && styles.viewButtonActive]}
              onPress={() => setActiveView('garment')}
            >
              <Image
                source={{ uri: currentResult.garmentImageUrl }}
                style={styles.thumbnailImage}
              />
              <Text
                style={[
                  styles.viewButtonText,
                  activeView === 'garment' && styles.viewButtonTextActive,
                ]}
              >
                Garment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.viewButton, activeView === 'result' && styles.viewButtonActive]}
              onPress={() => setActiveView('result')}
            >
              <Image
                source={{ uri: currentResult.resultImageUrl }}
                style={styles.thumbnailImage}
              />
              <Text
                style={[
                  styles.viewButtonText,
                  activeView === 'result' && styles.viewButtonTextActive,
                ]}
              >
                Result
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionsSection}>
            <Text style={styles.actionsSectionTitle}>Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
                <View style={styles.actionIcon}>
                  <Download size={24} color={Colors.primary} />
                </View>
                <Text style={styles.actionText}>Download</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <View style={styles.actionIcon}>
                  <Share2 size={24} color={Colors.secondary} />
                </View>
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleCopyUrl}>
                <View style={styles.actionIcon}>
                  <Copy size={24} color={Colors.primary} />
                </View>
                <Text style={styles.actionText}>Copy URL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Try Another Outfit"
            onPress={handleTryAnother}
            fullWidth
            size="large"
          />
        </View>
      </LinearGradient>

      <Toast
        visible={showToast}
        message={toastMessage}
        type={toastType}
        onHide={() => setShowToast(false)}
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
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  imageContainer: {
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  labelContainer: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: Colors.overlay,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    zIndex: 1,
  },
  imageLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.white,
  },
  mainImage: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH * 1.3,
    resizeMode: 'cover',
  },
  viewSelector: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  viewButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  viewButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceLight,
  },
  thumbnailImage: {
    width: 60,
    height: 80,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  viewButtonText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textMuted,
  },
  viewButtonTextActive: {
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
  },
  actionsSection: {
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.lg,
  },
  actionsSectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  actionButton: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    flex: 1,
    minWidth: 100,
    ...Shadows.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  actionText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
});
