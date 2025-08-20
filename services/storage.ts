import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const memoryStore: Record<string, string> = {};

async function canUseSecureStore(): Promise<boolean> {
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  if (await canUseSecureStore()) {
    await SecureStore.setItemAsync(key, value);
    return;
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window) {
    window.localStorage.setItem(key, value);
    return;
  }
  memoryStore[key] = value;
}

export async function getItem(key: string): Promise<string | null> {
  if (await canUseSecureStore()) {
    return await SecureStore.getItemAsync(key);
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window) {
    return window.localStorage.getItem(key);
  }
  return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null;
}

export async function deleteItem(key: string): Promise<void> {
  if (await canUseSecureStore()) {
    await SecureStore.deleteItemAsync(key);
    return;
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window) {
    window.localStorage.removeItem(key);
    return;
  }
  delete memoryStore[key];
}


