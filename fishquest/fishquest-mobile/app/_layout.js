import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { useFonts } from "expo-font";
import { View } from "react-native";
import { ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function Layout() {
  const [fontsLoaded] = useFonts({
    Jua: require("../assets/fonts/Jua-Regular.ttf"),
    Rubik: require("../assets/fonts/Rubik/Rubik-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
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
