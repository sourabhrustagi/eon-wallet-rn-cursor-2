import { apiClient } from '@/core/api';
import { API_CONFIG } from '@/core/config/api.config';
import type { LoginRequest, LoginResponse } from '../types';

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      return response.data;
    } catch (error: any) {
      // Handle mock interceptor response or actual API errors
      if (error.response?.data) {
        // If it's a validation error from mock, return it
        if (!error.response.data.success) {
          return error.response.data;
        }
        // If it's a successful mock response
        return error.response.data;
      }
      // Re-throw network errors (will be caught by mock interceptor)
      throw error;
    }
  },
};

