import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { COLORS, RADIUS } from "../constants/theme";

export default function ChallengeCard({ challenge }) {
  const progress = challenge?.progress ?? 0;
  const goal = challenge?.goal ?? 1;
  const percent = goal ? Math.min((progress / goal) * 100, 100) : 0;
  const difficulty = challenge?.difficulty || "easy";
  const difficultyStyles = {
    "very easy": {
      backgroundColor: "#C9EFC7",
    },
    easy: {
      backgroundColor: "#B7E4FF",
    },
    medium: {
      backgroundColor: "#FFE7A3",
    },
    hard: {
      backgroundColor: "#FFB38A",
    },
    "very hard": {
      backgroundColor: "#FF8A8A",
    },
  };
  return (
    <View style={[styles.card, difficultyStyles[difficulty]]}>
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
    </View>
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
