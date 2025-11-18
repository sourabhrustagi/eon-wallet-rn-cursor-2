import { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api.config';
import type { User } from '@/features/auth/types/index';

let mockResponseInterceptorId: number | null = null;

export const setupMockInterceptor = (apiClient: AxiosInstance) => {
  // Remove existing mock interceptor if any
  if (mockResponseInterceptorId !== null) {
    apiClient.interceptors.response.eject(mockResponseInterceptorId);
  }

  // Add mock response interceptor - always intercepts login requests (since API is not working)
  mockResponseInterceptorId = apiClient.interceptors.response.use(
    (response) => {
      // If it's a login response, we still want to mock it
      const config = response.config as InternalAxiosRequestConfig;
      if (config?.url?.includes(API_CONFIG.ENDPOINTS.AUTH.LOGIN) && config?.method === 'post') {
        // Return the actual response if API is working, otherwise this won't be called
        return response;
      }
      return response;
    },
    async (error) => {
      const config = error.config as InternalAxiosRequestConfig | undefined;
      
      // Mock login endpoint - always intercept login requests (API is not working)
      if (config?.url?.includes(API_CONFIG.ENDPOINTS.AUTH.LOGIN) && config?.method === 'post') {
        try {
          const mockResponse = await mockLoginResponse(config.data);
          
          // If it's an error response, reject with proper format
          if (mockResponse.status >= 400) {
            return Promise.reject({
              response: mockResponse,
              config,
              isAxiosError: true,
            });
          }
          
          // Return success response
          return Promise.resolve(mockResponse);
        } catch (mockError) {
          return Promise.reject(mockError);
        }
      }

      // Mock slides endpoint - always intercept slides requests (API is not working)
      if (config?.url?.includes(API_CONFIG.ENDPOINTS.WELCOME.SLIDES) && config?.method === 'get') {
        try {
          const mockResponse = await mockSlidesResponse();
          
          // If it's an error response, reject with proper format
          if (mockResponse.status >= 400) {
            return Promise.reject({
              response: mockResponse,
              config,
              isAxiosError: true,
            });
          }
          
          // Return success response
          return Promise.resolve(mockResponse);
        } catch (mockError) {
          return Promise.reject(mockError);
        }
      }

      return Promise.reject(error);
    }
  );
};

// Mock login response
const mockLoginResponse = async (requestData: any): Promise<AxiosResponse> => {
  const { email, password } = requestData || {};

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock validation
  if (!email || !password) {
    const errorResponse: AxiosResponse = {
      data: {
        success: false,
        message: 'Email and password are required',
      },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as AxiosRequestConfig,
    };
    return errorResponse;
  }

  if (password.length < 6) {
    const errorResponse: AxiosResponse = {
      data: {
        success: false,
        message: 'Password must be at least 6 characters',
      },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as AxiosRequestConfig,
    };
    return errorResponse;
  }

  // Mock successful login
  const mockUser: User = {
    id: '1',
    email,
    name: email.split('@')[0],
  };
  const mockToken = `mock-jwt-token-${Date.now()}`;

  const successResponse: AxiosResponse = {
    data: {
      success: true,
      data: {
        user: mockUser,
        token: mockToken,
      },
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as AxiosRequestConfig,
  };

  return successResponse;
};

// Mock slides response
const mockSlidesResponse = async (): Promise<AxiosResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock slides data
  const mockSlides = [
    {
      id: 1,
      title: 'Secure & Safe',
      description: 'Your crypto assets are protected with bank-level security and encryption',
      icon: 'lock.shield.fill',
    },
    {
      id: 2,
      title: 'Easy to Use',
      description: 'Manage your digital assets with an intuitive and user-friendly interface',
      icon: 'hand.tap.fill',
    },
    {
      id: 3,
      title: 'Fast Transactions',
      description: 'Send and receive crypto instantly with low fees and high speed',
      icon: 'bolt.fill',
    },
  ];

  const successResponse: AxiosResponse = {
    data: {
      success: true,
      data: mockSlides,
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as AxiosRequestConfig,
  };

  return successResponse;
};

