import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";

export async function getStoredPushToken() {
  return await SecureStore.getItemAsync("expoPushToken");
}

export async function storePushToken(token) {
  if (token) {
    await SecureStore.setItemAsync("expoPushToken", token);
  }
}

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    throw new Error("Push notifications require a physical device.");
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    throw new Error("Push notification permissions not granted.");
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;
  await storePushToken(token);
  return token;
}
