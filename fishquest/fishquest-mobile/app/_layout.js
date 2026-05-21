import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { View } from "react-native";
import LoadingIndicator from "@/components/LoadingIndicator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import GradientBackground from "../components/GradientBackground";
import { getToken } from "../api/auth";
import { syncPendingCatchLogs } from "../api/offlineLogs";
export default function Layout() {
  const [fontsLoaded] = useFonts({
    Jua: require("../assets/fonts/Jua-Regular.ttf"),
    Rubik: require("../assets/fonts/Rubik/Rubik-Medium.ttf"),
  });

  useEffect(() => {
    async function syncPendingLogs() {
      const token = await getToken();
      if (!token) return;
      await syncPendingCatchLogs(token);
    }

    syncPendingLogs();
  }, []);

  if (!fontsLoaded) {
    return (
      <GradientBackground>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <LoadingIndicator text="Getting Things Ready" color="#fff" />
        </View>
      </GradientBackground>
    );
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
