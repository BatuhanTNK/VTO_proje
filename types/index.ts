export interface TryOnResult {
  id: string;
  personImageUrl: string;
  garmentImageUrl: string;
  resultImageUrl: string;
  isFavorite: boolean;
  createdAt: string;
  garmentType?: 'tops' | 'bottoms' | 'one-pieces';
  metadata?: Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TryOnRequestPayload {
  personImageUrl: string;
  garmentImageUrl: string;
  garmentType?: 'tops' | 'bottoms' | 'one-pieces';
  category?: string;
}

export interface TryOnApiResponse {
  success: boolean;
  resultImageUrl?: string;
  message?: string;
  error?: string;
}

export interface ImageSource {
  uri: string;
  type: 'url' | 'camera' | 'gallery';
}

export interface SampleImage {
  id: string;
  url: string;
  type: 'person' | 'garment';
  description: string;
  thumbnail?: string;
}
