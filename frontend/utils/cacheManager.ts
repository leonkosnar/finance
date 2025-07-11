import AsyncStorage from "@react-native-async-storage/async-storage";

export const CACHE_KEYS = ["account", "transactions", "spaces"];

export const cacheData = async (key: string, data: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to cache", key, err);
  }
};

export const loadCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Failed to load cache", key, err);
    return null;
  }
};

export const clearCache = async () => {
  await AsyncStorage.multiRemove(CACHE_KEYS);
};
