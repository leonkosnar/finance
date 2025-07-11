import { create } from "zustand";
import { AppState } from "react-native";
import * as Keychain from "react-native-keychain";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthState = {
  user: string | null;
  token: string | null;
  isLoading: boolean;
  login: ( username: string, password: string, bankPassword: string ) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredCredentials: () => Promise<void>;
  loadNames: () => Promise<{ firstname: string | null; lastname: string | null }>;
  loadUserInputs: () => Promise<{ username: string | null; bankPassword: string | null }>;
};

const isDev = __DEV__;
const secureStore = {
  async save(username: string, token: string, bankPassword: string, firstname: string, lastname: string) {
    if (isDev) {
      await AsyncStorage.multiSet([
        ["username", username],
        ["token", token],
        ["bankPassword", bankPassword],
        ["firstname", firstname],
        ["lastname", lastname]
      ]);
    } else {
      await Keychain.setGenericPassword(username, token);
      await Keychain.setInternetCredentials("bankPassword", username, bankPassword);
      await Keychain.setInternetCredentials("firstname", username, firstname);
      await Keychain.setInternetCredentials("lastname", username, lastname);
    }
  },

  async load() {
    if (isDev) {
      const [username, token, bankPassword, firstname, lastname] = await Promise.all([
        AsyncStorage.getItem("username"),
        AsyncStorage.getItem("token"),
        AsyncStorage.getItem("bankPassword"),
        AsyncStorage.getItem("firstname"),
        AsyncStorage.getItem("lastname"),
      ]);
      return { username, token, bankPassword, firstname, lastname };
    } else {
      const creds = await Keychain.getGenericPassword();
      const bank = await Keychain.getInternetCredentials("bankPassword");
      const firstname = await Keychain.getInternetCredentials("firstname");
      const lastname = await Keychain.getInternetCredentials("lastname");
      if (!creds || !bank || !firstname || !lastname) return null;
      return {
        username: creds.username,
        token: creds.password,
        bankPassword: bank.password,
        firstname: firstname.password,
        lastname: lastname.password
      };
    }
  },

  async clear() {
    if (isDev) {
      await AsyncStorage.multiRemove(["token"]);
    } else {
      await Keychain.resetGenericPassword();
      // await Keychain.resetInternetCredentials('bankPassword');
    }
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  loadNames: async () => {
    const creds = await secureStore.load();
    return {
      firstname: creds?.firstname ?? null,
      lastname: creds?.lastname ?? null,
    };
  },

  loadUserInputs: async () => {
    const creds = await secureStore.load();
    return {
      username: creds?.username ?? null,
      bankPassword: creds?.bankPassword ?? null,
    };
  },

  loadStoredCredentials: async () => {
    const creds = await secureStore.load();
    if (creds) {
      set({ user: creds.username, token: creds.token });
    }
    set({ isLoading: false });
  },

  login: async (username, password, bankPassword) => {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, bank_password: bankPassword }),
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();
    await secureStore.save(username, data.token, bankPassword, data.firstname, data.lastname);
    set({ user: username, token: data.token });
  },

  logout: async () => {
    await secureStore.clear();
    set({ user: null, token: null });
  },
}));

AppState.addEventListener("change", async (state) => {
  if (state === "background") {
    await secureStore.clear();
  }
});
