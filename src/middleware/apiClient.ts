import axios, { AxiosError } from "axios";
import { store } from "@/lib/store";
import { updateAccessToken, logout } from "@/lib/features/authSlice";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API}`
});


let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

/**
 * Helper to perform a full logout
 * Clears Redux state, cookies, and NextAuth session
 */
const handleGlobalLogout = async () => {
  // Clear Redux state and cookies via authSlice
  if (store) {
    store.dispatch(logout());
  } else {
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    Cookies.remove('user');
  }

  // If on client-side, sign out from NextAuth and redirect to home
  if (typeof window !== 'undefined') {
    try {
      await signOut({ redirect: false });
      window.location.href = '/';
    } catch (error) {
      console.error("Error during auto-logout signout:", error);
      window.location.href = '/';
    }
  }
};

// Process all queued requests after token refresh
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

// Request interceptor - attach access token
apiClient.interceptors.request.use(
  (config) => {
    // Try to get token from store first, then cookies
    const token = store?.getState()?.auth?.accessToken || Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh and auto-logout
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Check if error is 401 Unauthorized
    if (error.response?.status === 401) {
      const refreshToken = store?.getState()?.auth?.refreshToken || Cookies.get('refreshToken');

      // If we haven't retried yet and have a refresh token, try refreshing
      if (!originalRequest._retry && refreshToken) {
        originalRequest._retry = true;

        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            .catch(err => Promise.reject(err));
        }

        // Set refreshing flag to prevent multiple refresh attempts
        isRefreshing = true;

        try {
          // Call refresh endpoint
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API}/api/Auth/refresh`,
            { refreshToken }
          );

          const result = response.data.data;
          const newAccessToken = typeof result === 'string' ? result : result?.accessToken;

          if (!newAccessToken) {
            throw new Error('No access token in refresh response');
          }

          if (store) {
            store.dispatch(updateAccessToken(newAccessToken));
          } else {
            Cookies.set('token', newAccessToken, { expires: 7 });
          }

          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);

        } catch (refreshError) {
          processQueue(refreshError, null);
          await handleGlobalLogout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token available or already retried and still getting 401
        await handleGlobalLogout();
      }
    }

    return Promise.reject(error);
  }
);
export default apiClient;
