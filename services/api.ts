import axios, { AxiosError } from 'axios';
import { TryOnRequestPayload, TryOnApiResponse } from '../types';

const FAL_AI_API_URL = 'https://fal.run/fal-ai/image-apps-v2/virtual-try-on';
// YENI VE GEÇERLI API ANAHTARI
const FAL_AI_API_KEY = '0677c7e9-9f90-4479-bf8f-2bd325ba72d8:98fd31fcc17f6d78468a8298ba58b6fb'; 
const API_TIMEOUT = 45000;

export class ApiService {
  static async processTryOn(payload: TryOnRequestPayload): Promise<TryOnApiResponse> {
    try {
      console.log('🚀 Starting virtual try-on process... [CLIENT-SIDE]');
      
      // NIHAI DEGISIKLIK: Sunucunun istediği gibi "input" nesnesi kaldırıldı.
      const requestBody = {
        person_image_url: payload.personImageUrl,
        clothing_image_url: payload.garmentImageUrl,
      };

      console.log('📤 Sending request to fal.ai API... [CLIENT-SIDE]');
      console.log('📦 GÖNDERİLEN BODY (Final):', JSON.stringify(requestBody, null, 2));

      const response = await axios.post(
        FAL_AI_API_URL,
        requestBody,
        {
          headers: {
            'Authorization': `Key ${FAL_AI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: API_TIMEOUT,
        }
      );

      console.log('✅ API Response received:', response.status);

      if (response.data && Array.isArray(response.data.images) && response.data.images.length > 0 && response.data.images[0].url) {
        console.log('🎉 Try-on successful!');
        return {
          success: true,
          resultImageUrl: response.data.images[0].url,
          message: 'Virtual try-on başarıyla tamamlandı!',
        };
      }

      console.error('❌ Invalid response format:', response.data);
      return {
        success: false,
        error: 'AI servisinden beklenmeyen yanıt formatı alındı.',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private static handleError(error: unknown): TryOnApiResponse {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`📛 Response error (${error.response.status}):`, error.response.data);
      return { success: false, error: `Sunucu Hatası: ${error.response.status}` };
    }
    return { success: false, error: 'Beklenmedik bir hata oluştu.' };
  }
}