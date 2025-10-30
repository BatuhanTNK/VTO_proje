import axios, { AxiosError } from 'axios';
import { FalAIRequest, FalAIResponse, TryOnResponse } from '../types';

// HATA 1 DÜZELTİLDİ: Doğru API adresi kullanıldı.
const FAL_AI_API_URL = 'https://fal.run/fal-ai/image-apps-v2/virtual-try-on';

// API anahtarını .env dosyasından okumak doğru bir yöntem.
const FAL_AI_API_KEY = process.env.FAL_AI_API_KEY;
const REQUEST_TIMEOUT = 45000; // Timeout süresini biraz artırdım.

export class FalAiService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    if (!FAL_AI_API_KEY) {
      throw new Error('FAL_AI_API_KEY .env dosyasında bulunamadı!');
    }

    this.apiUrl = FAL_AI_API_URL;
    this.apiKey = FAL_AI_API_KEY;
  }

  async processTryOn(request: FalAIRequest): Promise<TryOnResponse> {
    try {
      console.log('Sending request to fal.ai API with correct format...');

      // HATA 3 DÜZELTİLDİ: İstek, "input" nesnesi ile sarmalandı.
      const requestBody = {
        input: request
      };

      const response = await axios.post<FalAIResponse>(
        this.apiUrl,
        requestBody,
        {
          headers: {
            // HATA 2 DÜZELTİLDİ: "Bearer" yerine "Key" kullanıldı.
            'Authorization': `Key ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: REQUEST_TIMEOUT
        }
      );

      // HATA 4 DÜZELTİLDİ: Yanıt, "images" dizisine göre okundu.
      if (response.data && Array.isArray(response.data.images) && response.data.images.length > 0 && response.data.images[0].url) {
        console.log('Successfully received response from fal.ai');
        return {
          success: true,
          resultImageUrl: response.data.images[0].url,
          message: 'Try-on processed successfully'
        };
      } else {
        console.error('Unexpected response format:', response.data);
        return {
          success: false,
          error: 'Unexpected response format from AI service'
        };
      }
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): TryOnResponse {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>; // Hata tipini daha geniş tutalım.

        if (axiosError.code === 'ECONNABORTED') {
            return { success: false, error: 'Request timeout' };
        }
        if (axiosError.response) {
            console.error(`API Error: ${axiosError.response.status}`, axiosError.response.data);
            return { success: false, error: `API Error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`};
        }
        if (axiosError.request) {
            return { success: false, error: 'No response from server' };
        }
    }
    console.error('Unknown error:', error);
    return { success: false, error: 'An unknown error occurred' };
  }
}