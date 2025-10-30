export interface TryOnRequest {
  personImageUrl: string;
  garmentImageUrl: string;
  garmentType?: 'tops' | 'bottoms' | 'one-pieces';
  category?: string;
}

export interface TryOnResponse {
  success: boolean;
  resultImageUrl?: string;
  message?: string;
  error?: string;
}

export interface FalAIRequest {
  person_image_url: string;
  garment_image_url: string;
  garment_type?: string;
  category?: string;
}

interface FalImage {
  url: string;
  content_type: string;
  width: number;
  height: number;
  file_name: string;
  file_size: number;
}

export interface FalAIResponse {
  images: FalImage[];
  timings: {
    inference: number;
  };
}

export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
}