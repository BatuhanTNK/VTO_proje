import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TryOnResult, ImageSource } from '../types';
import { HistoryService } from '../services/historyService';

interface TryOnContextType {
  history: TryOnResult[];
  favorites: TryOnResult[];
  selectedPersonImage: ImageSource | null;
  selectedGarmentImage: ImageSource | null;
  currentResult: TryOnResult | null;
  isLoading: boolean;
  error: string | null;

  setSelectedPersonImage: (image: ImageSource | null) => void;
  setSelectedGarmentImage: (image: ImageSource | null) => void;
  setCurrentResult: (result: TryOnResult | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  loadHistory: () => Promise<void>;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (id: string, isFavorite: boolean) => Promise<void>;
  deleteFromHistory: (id: string) => Promise<void>;
  clearAllHistory: () => Promise<void>;
  resetSelection: () => void;
}

const TryOnContext = createContext<TryOnContextType | undefined>(undefined);

export const TryOnProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<TryOnResult[]>([]);
  const [favorites, setFavorites] = useState<TryOnResult[]>([]);
  const [selectedPersonImage, setSelectedPersonImage] = useState<ImageSource | null>(null);
  const [selectedGarmentImage, setSelectedGarmentImage] = useState<ImageSource | null>(null);
  const [currentResult, setCurrentResult] = useState<TryOnResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    const data = await HistoryService.getHistory();
    setHistory(data);
  }, []);

  const loadFavorites = useCallback(async () => {
    const data = await HistoryService.getFavorites();
    setFavorites(data);
  }, []);

  const toggleFavorite = useCallback(async (id: string, isFavorite: boolean) => {
    const success = await HistoryService.toggleFavorite(id, isFavorite);
    if (success) {
      await loadHistory();
      await loadFavorites();
      if (currentResult && currentResult.id === id) {
        setCurrentResult({ ...currentResult, isFavorite });
      }
    }
  }, [loadHistory, loadFavorites, currentResult]);

  const deleteFromHistory = useCallback(async (id: string) => {
    const success = await HistoryService.deleteFromHistory(id);
    if (success) {
      await loadHistory();
      await loadFavorites();
    }
  }, [loadHistory, loadFavorites]);

  const clearAllHistory = useCallback(async () => {
    const success = await HistoryService.clearAllHistory();
    if (success) {
      setHistory([]);
      setFavorites([]);
    }
  }, []);

  const resetSelection = useCallback(() => {
    setSelectedPersonImage(null);
    setSelectedGarmentImage(null);
    setError(null);
  }, []);

  const value: TryOnContextType = {
    history,
    favorites,
    selectedPersonImage,
    selectedGarmentImage,
    currentResult,
    isLoading,
    error,
    setSelectedPersonImage,
    setSelectedGarmentImage,
    setCurrentResult,
    setIsLoading,
    setError,
    loadHistory,
    loadFavorites,
    toggleFavorite,
    deleteFromHistory,
    clearAllHistory,
    resetSelection,
  };

  return <TryOnContext.Provider value={value}>{children}</TryOnContext.Provider>;
};

export const useTryOn = (): TryOnContextType => {
  const context = useContext(TryOnContext);
  if (!context) {
    throw new Error('useTryOn must be used within a TryOnProvider');
  }
  return context;
};
