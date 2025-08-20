import 'react-native-url-polyfill/auto';
import axios, { AxiosInstance } from 'axios';

export const AUTH_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:y9bWB5VY';
export const OTP_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:W6lplqTU';

// Create axios instances for different Xano API groups
export const authApi: AxiosInstance = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const otpApi: AxiosInstance = axios.create({
  baseURL: OTP_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Utility to set auth header on both clients
export const setAuthTokenHeader = (token: string | null) => {
  const headerValue = token ? `Bearer ${token}` : '';
  if (token) {
    authApi.defaults.headers.common.Authorization = headerValue;
    otpApi.defaults.headers.common.Authorization = headerValue;
  } else {
    delete authApi.defaults.headers.common.Authorization;
    delete otpApi.defaults.headers.common.Authorization;
  }
};


