import axios from 'axios';

// Primary base URL: env override, then Render, then localhost
const PRIMARY_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: PRIMARY_BASE_URL,
  withCredentials: true
});

// Retry once on network/5xx errors against the fallback base URL
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error?.config;
    const status = error?.response?.status as number | undefined;
    const isNetworkError = !error?.response;
    const shouldRetry = isNetworkError || (status !== undefined && status >= 500);

    if (!config || (config as any).__fallbackTried || !shouldRetry) {
      return Promise.reject(error);
    }

    (config as any).__fallbackTried = true;
    const previousBaseURL = config.baseURL || api.defaults.baseURL;
    try {
      config.baseURL = PRIMARY_BASE_URL;
      const resp = await api.request(config);
      return resp;
    } catch (e) {
      // restore original base URL on failure and bubble original error
      config.baseURL = previousBaseURL;
      return Promise.reject(error);
    }
  }
);


