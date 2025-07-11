import { AppState } from "react-native";
import { clearCache } from "@/utils/cacheManager";
import { secureStore } from "@/hooks/useAuthStore";

let currentState = AppState.currentState;

export const registerAppStateListener = () => {
  AppState.addEventListener("change", async (nextState) => {
    if (currentState === "active" && (nextState === "background" || nextState === "inactive")) {
      await clearCache();
      await secureStore.clear();
    }
    currentState = nextState;
  });
};
