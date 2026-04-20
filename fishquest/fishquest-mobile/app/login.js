import { router } from "expo-router";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import GradientBackground from "../components/GradientBackground";
import { Alert, ActivityIndicator, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { COLORS } from "../constants/theme";
const API_URL = "https://fishquest.onrender.com";
export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [error, setError] = useState(false);
  async function handleLogin(username, password) {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.toLowerCase().trim(),
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data); // ✅ correct
        router.replace("/home");
      } else {
        setError(true);
        Alert.alert("Error", data.message || "Login failed");
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <GradientBackground>
      {loading && (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={styles.center}
        />
      )}
      {!loading && (
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.content}
            enableOnAndroid
            extraScrollHeight={10}
          >
            <AuthForm
              buttonText="Log In"
              onSubmit={handleLogin}
              footerText="Don't have an account?"
              footerLinkText="Sign up"
              footerHref="/signup"
              errorText={error}
            />
          </KeyboardAwareScrollView>
        </SafeAreaView>
      )}
    </GradientBackground>
  );
}
const styles = StyleSheet.create({
  center: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
