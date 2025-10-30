import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Upload, Cpu, Share2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
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
import { SAMPLE_PERSON_IMAGES, SAMPLE_GARMENT_IMAGES, HOW_IT_WORKS } from '@/constants/samples';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { resetSelection } = useTryOn();

  const handleStartTryOn = () => {
    resetSelection();
    router.push('/select-images');
  };

  const handleTrySample = () => {
    resetSelection();
    router.push('/select-images');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={Gradients.background} style={styles.gradient}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Sparkles size={40} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Virtual Try-On</Text>
            <Text style={styles.subtitle}>
              See how clothes look on you instantly with AI
            </Text>
          </View>

          <View style={styles.ctaContainer}>
            <Button
              title="Try Virtual Outfit"
              onPress={handleStartTryOn}
              size="large"
              fullWidth
              icon={<Upload size={24} color={Colors.white} />}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <View style={styles.stepsContainer}>
              {HOW_IT_WORKS.map((step, index) => (
                <View key={step.id} style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDescription}>{step.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sample Gallery</Text>
              <TouchableOpacity onPress={handleTrySample}>
                <Text style={styles.linkText}>Try Sample</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryContainer}
            >
              {SAMPLE_PERSON_IMAGES.slice(0, 2).map((sample) => (
                <View key={sample.id} style={styles.sampleCard}>
                  <Image source={{ uri: sample.url }} style={styles.sampleImage} />
                  <Text style={styles.sampleLabel}>Person</Text>
                </View>
              ))}
              {SAMPLE_GARMENT_IMAGES.slice(0, 2).map((sample) => (
                <View key={sample.id} style={styles.sampleCard}>
                  <Image source={{ uri: sample.url }} style={styles.sampleImage} />
                  <Text style={styles.sampleLabel}>Garment</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.featuresSection}>
            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <Cpu size={24} color={Colors.primary} />
              </View>
              <Text style={styles.featureText}>AI-Powered Technology</Text>
            </View>
            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <Upload size={24} color={Colors.secondary} />
              </View>
              <Text style={styles.featureText}>Easy Image Upload</Text>
            </View>
            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <Share2 size={24} color={Colors.primary} />
              </View>
              <Text style={styles.featureText}>Share Results</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  ctaContainer: {
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  linkText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
  stepsContainer: {
    gap: Spacing.md,
  },
  step: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  stepDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  galleryContainer: {
    gap: Spacing.md,
  },
  sampleCard: {
    width: 150,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  sampleImage: {
    width: 150,
    height: 200,
    resizeMode: 'cover',
  },
  sampleLabel: {
    padding: Spacing.sm,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text,
    textAlign: 'center',
  },
  featuresSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
});
