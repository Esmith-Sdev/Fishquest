import { createContext, useContext, useState, useEffect } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
const AuthContext = createContext(null);

const API_URL = process.env.EXPO_PUBLIC_API_URL;
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const isAuthenticated = !!user;
  const [userStats, setUserStats] = useState({
    xp: 0,
    level: 1,
    levelTitle: "Minnow Wrangler",
  });
  useEffect(() => {
    if (token) {
      refreshUserStats();
    }
  }, [token]);
  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const storedUser = await SecureStore.getItemAsync("user");
        const storedToken = await SecureStore.getItemAsync("token");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch {
        setUser(null);
        setToken(null);
      }
    }

    loadStoredAuth();
  }, []);
  async function refreshUserStats() {
    const storedToken = await SecureStore.getItemAsync("token");
    if (!storedToken) return;

    const res = await fetch(`${API_URL}/api/user-stats`, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });

    const data = await res.json();

    setUserStats({
      xp: data.xp || 0,
      level: data.level || 1,
      levelTitle: data.levelTitle || "Minnow Wrangler",
    });
  }
  async function login(data) {
    setUser(data.user);
    setToken(data.token);
    await SecureStore.setItemAsync("user", JSON.stringify(data.user));
    await SecureStore.setItemAsync("token", data.token);
  }

  async function logout() {
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        userStats,
        refreshUserStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
