import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
export async function enableBiometrics() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();

  if (!hasHardware) {
    throw new Error(
      "Biometric authentication is not supported on this device.",
    );
  }

  const enrolled = await LocalAuthentication.isEnrolledAsync();

  if (!enrolled) {
    throw new Error("No fingerprint or Face ID is set up on this device.");
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Enable biometric login for FishQuest",
    fallbackLabel: "Use passcode",
  });

  if (!result.success) {
    throw new Error("Biometric setup was cancelled.");
  }

  await SecureStore.setItemAsync("biometricEnabled", "true");

  return true;
}
export async function biometricLogin() {
  const enabled = await SecureStore.getItemAsync("biometricEnabled");
  if (enabled !== "true") {
    return null;
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Login to FishQuest",
    fallbackLabel: "Use password",
  });

  if (!result.success) {
    return null;
  }

  const token = await SecureStore.getItemAsync("token");
  const userId = await SecureStore.getItemAsync("userId");
  const username = await SecureStore.getItemAsync("username");

  if (!token || !userId || !username) {
    return null;
  }

  return {
    token,
    user: {
      id: userId,
      username,
    },
  };
}
export async function disableBiometrics() {
  await SecureStore.deleteItemAsync("token");
  await SecureStore.deleteItemAsync("userId");
  await SecureStore.deleteItemAsync("username");
  await SecureStore.deleteItemAsync("biometricEnabled");
}
