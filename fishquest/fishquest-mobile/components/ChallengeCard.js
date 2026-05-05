import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Animated,
} from "react-native";

import { router } from "expo-router";
import { COLORS, RADIUS } from "../constants/theme";
import VeryHardGradientCard from "./VeryHardGradientCard";
import GradientProgress from "./GradientProgress";
import GradientCard from "./GradientCard";
export default function ChallengeCard({ challenge }) {
  const progress = challenge?.progress ?? 0;

  const goal = challenge?.goal ?? 1;
  const percent = goal ? Math.min((progress / goal) * 100, 100) : 0;

  const difficulty = challenge?.difficulty || "easy";
  const isVeryHard = difficulty === "very hard";

  const Wrapper =
    difficulty === "very hard" ? VeryHardGradientCard : GradientCard;

  return (
    <Wrapper
      style={[styles.card, difficulty === "very hard" && styles.veryHardCard]}
    >
      {difficulty === "very hard" && (
        <Image
          source={require("../assets/images/icons/Crown.png")}
          style={styles.crown}
          resizeMode="contain"
        />
      )}
      <Text style={[styles.xp, isVeryHard && styles.whiteText]}>
        +{challenge?.rewardXp}XP
      </Text>
      <Text style={[styles.title, isVeryHard && styles.whiteText]}>
        {challenge?.title ?? "Challenge"}
      </Text>
      <View style={styles.progressRow}>
        <Text style={[styles.progressText, isVeryHard && styles.whiteText]}>
          {progress}/{goal}
        </Text>
        <View style={styles.progressTrack}>
          <GradientProgress
            style={{
              width: `${percent}%`,
              height: "100%",
            }}
          />
        </View>
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
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#dedede",
    padding: 16,
    borderRadius: RADIUS.md,
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  progressText: {
    fontFamily: "Jua",
    fontWeight: "700",
    color: "#000",
    fontSize: 13,
  },
  veryHardCard: {
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.8)",
    elevation: 5,
    shadowColor: "#000",
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
  progressRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
  },
  title: {
    color: "#000",
    marginVertical: 2,
    marginBottom: 5,
    fontSize: 15,
    fontWeight: "400",
    fontFamily: "Jua",
    textDecorationLine: "underline",
  },
  whiteText: {
    color: "#fff",
  },
  progressTrack: {
    width: "90%",
    height: 12,
    backgroundColor: "#ffffff",
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

  button: {
    boxShadow: "0px 4px 0px #733800",
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 18,
    minWidth: 80,
    width: 100,
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
