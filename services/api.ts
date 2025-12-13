import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://api.example.com', // Replace with your actual API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens, etc.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    // const token = await AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with mock implementation
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Mock interceptor for card application endpoint
    if (
      originalRequest?.url?.includes('/card-application') &&
      originalRequest?.method === 'post' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Return mock success response
      return Promise.resolve({
        data: {
          success: true,
          message: 'Card application submitted successfully',
          data: {
            applicationId: `APP-${Date.now()}`,
            status: 'pending',
            submittedAt: new Date().toISOString(),
            estimatedProcessingTime: '3-5 business days',
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: originalRequest,
      });
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default apiClient;

