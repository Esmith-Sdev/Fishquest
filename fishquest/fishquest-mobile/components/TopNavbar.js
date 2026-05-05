import { View, Text, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../constants/theme";
import { LEVELS } from "../data/levels.config";
import Coin from "../assets/images/icons/Coin.png";
import { useAuth } from "@/context/AuthContext";

export default function Topbar() {
  const { userStats } = useAuth();

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

  return (
    <View style={styles.topNavbar}>
      <View style={styles.left}>
        <View>
          <Text style={styles.smallText}>{setTime}</Text>
          <Text style={styles.smallText}>{setDate}</Text>
        </View>
      </View>

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

      <View style={styles.right}>
        <Link href="/shop" asChild>
          <View style={styles.iconButton}>
            <Image source={Coin} style={styles.coin} resizeMode="contain" />
          </View>
        </Link>

        <View style={styles.iconButton}>
          <Ionicons name="people" size={24} color="#fff" />
        </View>
      </View>
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
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 12,
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
    width: "100%",
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
