import { apiClient } from '@/core/api';
import { API_CONFIG } from '@/core/config/api.config';
import type { SlidesResponse } from '../types';

export const welcomeAPI = {
  getSlides: async (): Promise<SlidesResponse> => {
    try {
      const response = await apiClient.get<SlidesResponse>(
        API_CONFIG.ENDPOINTS.WELCOME.SLIDES
      );
      return response.data;
    } catch (error: any) {
      // Handle mock interceptor response or actual API errors
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },
};

