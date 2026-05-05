import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    async function loadStoredAuth() {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(JSON.parse(storedToken));
        }
      } catch (err) {
        console.log("Error loading auth:", err);
      }
    }

    loadStoredAuth();
  }, []);
  async function refreshUserStats() {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/user-stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setUserStats({
      xp: data.xp || 0,
      level: data.level || 1,
      levelTitle: data.title || "Minnow Wrangler",
    });
  }
  async function login(data) {
    setUser(data.user);
    setToken(data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    await AsyncStorage.setItem("token", JSON.stringify(data.token));
  }

  async function logout() {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
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
