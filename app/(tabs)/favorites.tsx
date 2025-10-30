import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
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
import { TryOnResult } from '@/types';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - Spacing.lg * 3) / 2;

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, loadFavorites, setCurrentResult } = useTryOn();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  }, [loadFavorites]);

  const handleItemPress = (item: TryOnResult) => {
    setCurrentResult(item);
    router.push('/result');
  };

  const renderItem = ({ item }: { item: TryOnResult }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleItemPress(item)}
    >
      <Image source={{ uri: item.resultImageUrl }} style={styles.cardImage} />
      <View style={styles.cardOverlay}>
        <View style={styles.favoriteIndicator}>
          <Heart size={16} color={Colors.error} fill={Colors.error} />
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.cardDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Heart size={64} color={Colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyText}>
        Items you mark as favorite will appear here
      </Text>
      <Button
        title="Start Try-On"
        onPress={() => router.push('/select-images')}
        style={styles.emptyButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={Gradients.background} style={styles.gradient}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Heart size={24} color={Colors.error} fill={Colors.error} />
            <Text style={styles.headerTitle}>Favorites</Text>
          </View>
          <Text style={styles.countText}>{favorites.length} items</Text>
        </View>

        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  countText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textMuted,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  columnWrapper: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  card: {
    width: ITEM_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.md,
  },
  cardImage: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.3,
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: Spacing.sm,
  },
  favoriteIndicator: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  cardFooter: {
    padding: Spacing.sm,
    backgroundColor: Colors.background,
  },
  cardDate: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl * 2,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  emptyButton: {
    minWidth: 200,
  },
});
