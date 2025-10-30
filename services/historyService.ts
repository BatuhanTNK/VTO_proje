import { supabase } from './supabaseClient';
import { TryOnResult } from '../types';

export class HistoryService {
  static async saveToHistory(data: {
    personImageUrl: string;
    garmentImageUrl: string;
    resultImageUrl: string;
    garmentType?: string;
  }): Promise<TryOnResult | null> {
    try {
      const { data: result, error } = await supabase
        .from('tryon_history')
        .insert({
          person_image_url: data.personImageUrl,
          garment_image_url: data.garmentImageUrl,
          result_image_url: data.resultImageUrl,
          garment_type: data.garmentType,
          is_favorite: false,
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error saving to history:', error);
        return null;
      }

      return result ? this.mapToTryOnResult(result) : null;
    } catch (error) {
      console.error('Error saving to history:', error);
      return null;
    }
  }

  static async getHistory(): Promise<TryOnResult[]> {
    try {
      const { data, error } = await supabase
        .from('tryon_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
        return [];
      }

      return (data || []).map(this.mapToTryOnResult);
    } catch (error) {
      console.error('Error fetching history:', error);
      return [];
    }
  }

  static async getFavorites(): Promise<TryOnResult[]> {
    try {
      const { data, error } = await supabase
        .from('tryon_history')
        .select('*')
        .eq('is_favorite', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorites:', error);
        return [];
      }

      return (data || []).map(this.mapToTryOnResult);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  }

  static async toggleFavorite(id: string, isFavorite: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tryon_history')
        .update({ is_favorite: isFavorite })
        .eq('id', id);

      if (error) {
        console.error('Error toggling favorite:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  }

  static async deleteFromHistory(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tryon_history')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting from history:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting from history:', error);
      return false;
    }
  }

  static async clearAllHistory(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tryon_history')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) {
        console.error('Error clearing history:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      return false;
    }
  }

  private static mapToTryOnResult(data: any): TryOnResult {
    return {
      id: data.id,
      personImageUrl: data.person_image_url,
      garmentImageUrl: data.garment_image_url,
      resultImageUrl: data.result_image_url,
      isFavorite: data.is_favorite,
      createdAt: data.created_at,
      garmentType: data.garment_type,
      metadata: data.metadata,
    };
  }
}
