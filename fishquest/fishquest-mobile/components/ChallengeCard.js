import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { router } from "expo-router";
import { COLORS, RADIUS } from "../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import SpecialButton from "./SpecialButton";
export default function ChallengeCard({ challenge }) {
  const progress = challenge?.progress ?? 0;
  const goal = challenge?.goal ?? 1;
  const percent = goal ? Math.min((progress / goal) * 100, 100) : 0;
  const difficulty = challenge?.difficulty || "easy";
  function getGradientColors(difficulty) {
    switch (difficulty) {
      case "very easy":
        return ["#ccc", "#aaa"];
      case "easy":
        return ["#ccc", "#aaa"];
      case "medium":
        return ["#ccc", "#aaa"];
      case "hard":
        return ["#ccc", "#aaa"];
      case "very hard":
        return ["#89cdf5", "#2ba8e2"];
      default:
        return ["#ccc", "#aaa"];
    }
  }
  return (
    <LinearGradient colors={getGradientColors(difficulty)} style={styles.card}>
      {difficulty === "very hard" && (
        <Image
          source={require("../assets/images/icons/Crown.png")}
          style={styles.crown}
          resizeMode="contain"
        />
      )}
      <Text style={styles.xp}>+{challenge?.rewardXp}XP</Text>

      <Text style={styles.title}>{challenge?.title ?? "Challenge"}</Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%` }]} />
      </View>

      <Pressable
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: "/create-log",
            params: {
              challengeId: challenge.userChallengeId,
              templateKey: challenge.templateKey,
              challengeTitle: challenge.title,
            },
          })
        }
      >
        <Text style={styles.buttonText}>LOG</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#B2B2B2",
    padding: 16,
    borderRadius: RADIUS.md,
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  difficulty: {
    position: "absolute",
    top: 6,
    left: 10,
    fontFamily: "Jua",
    fontSize: 10,
    color: "#000",
  },
  disabledCard: {
    backgroundColor: "#212529",
    padding: 16,
    borderRadius: RADIUS.md,
    alignItems: "center",
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
  gradientButtonText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Jua",
    textAlign: "center",
  },
  title: {
    color: "#000",
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

  glowWrap: {
    shadowColor: "#ffffff",
    shadowOpacity: 0.9,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 14,
  },
  gradientButton: {
    borderRadius: RADIUS.pill,
    marginTop: 4,
    overflow: "hidden",
  },
  buttonInner: {
    paddingVertical: 4,
    paddingHorizontal: 18,
    minWidth: 80,
    alignItems: "center",
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
  crown: {
    position: "absolute",
    top: -28,
    alignSelf: "center",
    width: 50,
    height: 50,
    zIndex: 10,
  },
});
