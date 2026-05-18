import * as SecureStore from "expo-secure-store";

const API_URL = "https://fishquest.onrender.com";

export async function login(username, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  const cleanToken =
    typeof data.token === "string"
      ? data.token.replace(/^"|"$/g, "")
      : data.token;

  await SecureStore.setItemAsync("token", cleanToken);
  await SecureStore.setItemAsync("userId", String(data.user.id));
  await SecureStore.setItemAsync("username", data.user.username);
  return data;
}

export async function signup(username, password, email, preferences = {}) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      email,
      notificationsEnabled: preferences.notificationsEnabled,
      locationEnabled: preferences.locationEnabled,
      expoPushToken: preferences.expoPushToken,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Signup failed");
  }

  const cleanToken =
    typeof data.token === "string"
      ? data.token.replace(/^"|"$/g, "")
      : data.token;

  await SecureStore.setItemAsync("token", cleanToken);
  await SecureStore.setItemAsync("userId", String(data.user.id));
  await SecureStore.setItemAsync("username", data.user.username);

  return data;
}

export async function getToken() {
  const token = await SecureStore.getItemAsync("token");
  return token ? token.replace(/^"|"$/g, "") : null;
}

export async function getAuth() {
  return await SecureStore.getItemAsync("username");
}

export async function isAuthenticated() {
  const token = await SecureStore.getItemAsync("token");
  return !!token;
}
