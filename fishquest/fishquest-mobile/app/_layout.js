import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { useFonts } from "expo-font";
import { View } from "react-native";
import LoadingIndicator from "@/components/LoadingIndicator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import GradientBackground from "../components/GradientBackground";
export default function Layout() {
  const [fontsLoaded] = useFonts({
    Jua: require("../assets/fonts/Jua-Regular.ttf"),
    Rubik: require("../assets/fonts/Rubik/Rubik-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <GradientBackground>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <LoadingIndicator text="Loading Fonts" color="#fff" />
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
