import axios, { AxiosError } from "axios";
import { store } from "@/redux/store";
import { updateAccessToken, clearUser } from "@/redux/slices/userSlice";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}`
});


let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

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
    const token = store?.getState()?.user?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If 401 and haven't retried yet and refresh token exists
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      store.getState().user.refreshToken
    ) {
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
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/Auth/refresh`,
          { refreshToken: store.getState().user.refreshToken }
        );
        const result = await response.data.data;

        if (!result?.accessToken) {
          throw new Error('No access token in refresh response');
        }

        // Update Redux with new access token
        store.dispatch(updateAccessToken(result));

        // Resolve all queued requests with new token
        processQueue(null, result.accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        // Reject all queued requests
        processQueue(refreshError, null);

        // Clear user data
        store.dispatch(clearUser());

        // Only redirect if not already on login page
        if (typeof window !== 'undefined' && window.location.pathname !== '/') {
          window.location.href = "/";
        }

        return Promise.reject(refreshError);

      } finally {
        // Reset refreshing flag
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;