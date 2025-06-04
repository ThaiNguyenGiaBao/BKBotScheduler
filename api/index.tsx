import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Token storage keys
const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YTExNjM2Zi0xZGFhLTQ1MzEtYjdiYi1kZGRlMDQ2MmU1NDUiLCJlbWFpbCI6InZhbi5idWkyNDA1MDRAaGNtdXQuZWR1LnZuIiwiaWF0IjoxNzQ5MDE4NzQ1LCJleHAiOjE3NTE2MTA3NDV9.W6hytq2toyNqBKCnOtqKlZ8c7gLMWTuBmRKsrLe5fe4';

// API base URL
// const BASE_URL = "http://localhost:5000/api/v1/";
const BASE_URL = "http://103.82.133.50:5000/api/v1/";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth token management
export const tokenManager = {
  // Store tokens
  setTokens: async (access_token: string, refresh_token: string) => {
    try {
      console.log("Storing tokens:", { access_token, refresh_token });
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, access_token);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
    } catch (error) {
      console.error("Error storing tokens:", error);
    }
  },

  // Clear tokens (for logout)
  clearTokens: async () => {
    try {
      await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  },

  // Get access token
  getaccess_token: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  },

  // Get refresh token
  getrefresh_token: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  },
};

// Add request interceptor to attach access token
api.interceptors.request.use(
  async (config) => {
    const access_token = await tokenManager.getaccess_token();
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, add to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get refresh token
        const refresh_token = await tokenManager.getrefresh_token();
        
        if (!refresh_token) {
          throw new Error("No refresh token available");
        }

        // Call your refresh token endpoint
        const response = await axios.post(`${BASE_URL}/auth/refresh_token`, {
          refresh_token,
        });

        const { access_token, refresh_token: newrefresh_token } = response.data;
        
        // Store new tokens
        await tokenManager.setTokens(access_token, newrefresh_token);
        
        // Update authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        // Process queue with new token
        processQueue(null, access_token);
        
        // Retry original request with new token
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${access_token}`,
        };
        
        return api(originalRequest);
      } catch (refreshError) {
        // Process queue with error
        processQueue(refreshError, null);
        
        // Clear tokens on refresh failure
        await tokenManager.clearTokens();
        
        // Handle authentication failure (e.g., redirect to login)
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Initialize auth by loading token from storage on app start
export const initializeAuth = async () => {
  const access_token = await tokenManager.getaccess_token();
  if (access_token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  }
};

// Helper functions for auth
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password
    });
    
    const { access_token, refresh_token } = response.data;
    
    // Store tokens
    await tokenManager.setTokens(access_token, refresh_token);
    
    // Set default auth header
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  // Clear tokens from storage
  await tokenManager.clearTokens();
  
  // Remove auth header
  delete api.defaults.headers.common['Authorization'];
};

export default api;
