import AsyncStorage from "@react-native-async-storage/async-storage";

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

  await AsyncStorage.multiSet([
    ["token", cleanToken],
    ["userId", String(data.user.id)],
    ["username", data.user.username],
  ]);

  return data;
}

export async function signup(username, password, email) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Signup failed");
  }

  const cleanToken =
    typeof data.token === "string"
      ? data.token.replace(/^"|"$/g, "")
      : data.token;

  await AsyncStorage.multiSet([
    ["token", cleanToken],
    ["userId", String(data.user.id)],
    ["username", data.user.username],
  ]);

  return data;
}

export async function getToken() {
  const token = await AsyncStorage.getItem("token");
  return token ? token.replace(/^"|"$/g, "") : null;
}

export async function getAuth() {
  return await AsyncStorage.getItem("username");
}

export async function isAuthenticated() {
  const token = await AsyncStorage.getItem("token");
  return !!token;
}

export async function logout() {
  await AsyncStorage.multiRemove(["token", "userId", "username"]);
}
