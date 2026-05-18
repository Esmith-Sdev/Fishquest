import { router } from "expo-router";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import { enableBiometrics, biometricLogin } from "../utils/AuthStorage";
import * as LocalAuthentication from "expo-local-authentication";
import GradientBackground from "../components/GradientBackground";
import {
  Alert,
  Text,
  StyleSheet,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import LoadingIndicator from "../components/LoadingIndicator";
import { COLORS } from "../constants/theme";
import ConfirmModal from "../components/ConfirmModal";
const API_URL = "https://fishquest.onrender.com";
export default function LoginScreen() {
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
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
      await SecureStore.setItemAsync("token", data.token);
      await SecureStore.setItemAsync("userId", String(data.user.id));
      await SecureStore.setItemAsync("username", data.user.username);
      if (res.ok) {
        login(data);

        // Only show the biometric prompt if the device supports biometrics,
        // the device has enrolled biometrics, and the prompt hasn't been
        // shown before for this user/install.
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        const biometricEnabled = await SecureStore.getItemAsync(
          "biometricEnabled",
        );
        const biometricPromptShown = await SecureStore.getItemAsync(
          "biometricPromptShown",
        );

        if (
          hasHardware &&
          enrolled &&
          biometricEnabled !== "true" &&
          biometricPromptShown !== "true"
        ) {
          setShowBiometricPrompt(true);
        } else {
          router.replace("/home");
        }
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
  async function handleEnableBiometrics() {
    try {
      await enableBiometrics();
      await SecureStore.setItemAsync("biometricPromptShown", "true");
      alert("Biometric login enabled!");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }
  async function handleBiometricLogin() {
    try {
      const data = await biometricLogin();

      if (!data) {
        Alert.alert("Unavailable", "Biometric login is not enabled.");
        return;
      }

      login(data);
      router.replace("/home");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }
  // No-op here: settings modal provides control to enable/disable biometrics.
  return (
    <GradientBackground>
      {loading && (
        <View style={styles.centerState}>
          <LoadingIndicator text="Logging In" color="#fff" />
        </View>
      )}

      {!loading && (
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <KeyboardAwareScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.content}
              enableOnAndroid
              extraScrollHeight={10}
              keyboardShouldPersistTaps="handled"
            >
              <AuthForm
                buttonText="Log In"
                onSubmit={handleLogin}
                onBiometricLogin={handleBiometricLogin}
                footerText="Don't have an account?"
                footerLinkText="Sign up"
                footerHref="/signup"
                errorText={error}
              />
            </KeyboardAwareScrollView>
          </TouchableWithoutFeedback>
          {showBiometricPrompt && (
            <ConfirmModal
              title="Enable Biometric Login?"
              visible={showBiometricPrompt}
              onConfirm={async () => {
                await handleEnableBiometrics();
                setShowBiometricPrompt(false);
                router.replace("/home");
              }}
              onCancel={async () => {
                await SecureStore.setItemAsync(
                  "biometricPromptShown",
                  "true",
                );
                setShowBiometricPrompt(false);
                router.replace("/home");
              }}
            />
          )}
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
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Jua",
    marginTop: 10,
  },
});
