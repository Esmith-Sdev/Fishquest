import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState, useEffect, useMemo } from "react";
import { router } from "expo-router";
import { COLORS, RADIUS } from "../constants/theme";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
export default function DisabledChallengeCard({ challenge }) {
  const progress = challenge?.progress ?? 0;
  const goal = challenge?.goal ?? 1;
  const percent = goal ? (progress / goal) * 100 : 0;

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const availableText = useMemo(() => {
    const availableAt =
      challenge?.cooldownEndsAt || challenge?.availableAgainAt;

    if (!availableAt) return "Unavailable";

    const end = new Date(availableAt).getTime();
    const diff = Math.max(end - now, 0);

    if (diff <= 0) return "Available now";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `Available in ${hours}h ${minutes}m ${seconds}s`;
  }, [challenge?.cooldownEndsAt, challenge?.availableAgainAt, now]);

  return (
    <View style={styles.card}>
      <View style={styles.card}>
        <Text style={styles.xp}>+{challenge.rewardXp}XP</Text>
        <Text style={styles.title}>{challenge.title}</Text>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>

      <View style={styles.overlay}></View>
      <View style={styles.overlayContent}>
        <View style={styles.column}>
          <FontAwesome6 name="clock" size={24} color="white" />
          <Text style={styles.title}>{availableText}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.9)",
    borderRadius: 12,
  },
  overlayContent: {
    position: "absolute",
  },
  column: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#B2B2B2",
    padding: 16,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
  },
  xp: {
    position: "absolute",
    top: 6,
    right: 10,
    fontFamily: "Jua",
    fontWeight: "700",
    color: "#000",
    fontSize: 13,
  },
  title: {
    color: "#dedede",
    marginVertical: 2,
    fontSize: 13,
    fontWeight: "400",
    fontFamily: "Jua",
  },
  progressTrack: {
    width: "100%",
    height: 12,
    backgroundColor: "#ddd",
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },

  button: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 4,
    paddingHorizontal: 18,
    minWidth: 80,
    marginTop: 4,
    shadowColor: COLORS.secondaryDropShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
  },
  buttonText: {
    color: "#000",
    fontSize: 13,
    fontFamily: "Jua",
    textAlign: "center",
  },
});
