import { View, Text, Image, StyleSheet, Pressable, Alert } from "react-native";
import { Link } from "expo-router";

import { Animated } from "react-native";
import { useRef, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import { LEVELS } from "../data/levels.config";
import Coin from "../assets/images/icons/Coin.png";
import { useAuth } from "@/context/AuthContext";
import ForecastModal from "./ForecastModal";
export default function Topbar() {
  const { userStats } = useAuth();
  const [showForecast, setShowForecast] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const xp = userStats?.xp ?? 0;
  const level = userStats?.level ?? 1;
  const title = userStats?.levelTitle ?? "Minnow Wrangler";

  const currentLevel = LEVELS.find((l) => l.level === level) ?? LEVELS[0];
  const nextLevel = LEVELS.find((l) => l.level === level + 1);

  const currentMinXp = currentLevel.minXp;
  const nextMinXp = nextLevel?.minXp ?? currentMinXp;

  const xpIntoLevel = Math.max(xp - currentMinXp, 0);
  const xpNeededForLevel = nextMinXp - currentMinXp;

  const progressPercent =
    nextLevel && xpNeededForLevel > 0
      ? Math.min((xpIntoLevel / xpNeededForLevel) * 100, 100)
      : 100;
  const currentDate = new Date();

  const setDate = currentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const setTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const slideAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menuOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [menuOpen]);
  return (
    <View style={styles.topNavbar}>
      <View style={styles.navSpacer} />
      <View style={styles.center}>
        <Text style={styles.rankText}>
          Lv {level} • {title}
        </Text>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progressPercent}%` }]}
          />
          <Text style={styles.progressLabel}>{xp} XP</Text>
        </View>
      </View>
      <Pressable
        style={styles.hamButton}
        onPress={() => setMenuOpen((prev) => !prev)}
      >
        <Ionicons name={menuOpen ? "close" : "menu"} size={30} color="#fff" />
      </Pressable>
      {menuOpen && (
        <Pressable
          style={styles.backgroundOverlay}
          onPress={() => setMenuOpen(false)}
        />
      )}
      <Animated.View
        pointerEvents={menuOpen ? "auto" : "none"}
        style={[
          styles.dropdown,
          {
            opacity: slideAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Pressable
          onPress={() => {
            setMenuOpen(false);
            setShowForecast(true);
          }}
        >
          <Text style={styles.dropdownItem}>Fishing Forecast</Text>
        </Pressable>
        <View style={styles.dropdownDivider} />

        <Pressable
          onPress={() =>
            Alert.alert("Shop coming soon!", "Feature not available in Beta")
          }
        >
          <Text style={styles.dropdownItem}>Shop</Text>
        </Pressable>

        <View style={styles.dropdownDivider} />
        <Link href="/buddies" asChild>
          <Pressable onPress={() => setMenuOpen(false)}>
            <Text style={styles.dropdownItem}>Buddies</Text>
          </Pressable>
        </Link>
      </Animated.View>
      <ForecastModal
        visible={showForecast}
        onClose={() => setShowForecast(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topNavbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: COLORS.primary,
    width: "100%",
    zIndex: 1000,
  },
  backgroundOverlay: {
    position: "absolute",
    top: 67,
    left: -12,
    right: -12,
    height: 1000,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 998,
    elevation: 7,
  },
  navSpacer: {
    width: 40,
  },

  hamButton: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  dropdown: {
    position: "absolute",
    top: 67,
    left: -12,
    right: -12,
    backgroundColor: COLORS.primary,

    zIndex: 999,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#dedede",
    width: "100%",
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    fontSize: 16,
    fontFamily: "Jua",
    color: "#fff",
  },
  center: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  smallText: {
    color: "#fff",
    fontSize: 8,
  },
  rankText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 6,
    textAlign: "center",
    fontFamily: "Jua",
  },
  progressTrack: {
    width: "90%",
    height: 14,
    backgroundColor: "#d9d9d9",
    borderRadius: 999,
    overflow: "hidden",
    justifyContent: "center",
    borderColor: "#000",
    borderWidth: 1,
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.secondary,
    borderRadius: 999,
  },
  progressLabel: {
    textAlign: "center",
    fontSize: 10,
    color: "#000",
    fontWeight: "700",
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  coin: {
    width: 28,
    height: 28,
  },
});
