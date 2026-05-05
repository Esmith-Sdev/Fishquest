import { useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { COLORS, RADIUS } from "../constants/theme";
import TimedChallengeModal from "./TimedChallengeModal";
import GradientProgress from "./GradientProgress";
import DisabledChallengeCard from "./DisabledChallengeCard";
export default function TimedChallengeCard({ challenge, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const progress = challenge?.progress ?? 0;
  const isFinished = challenge?.isFinished;
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

      <Pressable style={styles.button} onPress={() => setShowModal(true)}>
        <Text style={styles.buttonText}>Start</Text>
      </Pressable>

      <TimedChallengeModal
        show={showModal}
        onHide={() => setShowModal(false)}
        challenge={challenge}
        onRefresh={onRefresh}
      />
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
    overflow: "visible",
  },
  difficulty: {
    position: "absolute",
    top: 6,
    left: 10,
    fontFamily: "Jua",
    fontSize: 10,
    color: "#000",
  },
  whiteText: {
    color: "#fff",
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
    marginBottom: 5,
    fontSize: 15,
    fontWeight: "400",
    fontFamily: "Jua",
    textDecorationLine: "underline",
  },
  progressTrack: {
    width: "100%",
    height: 12,
    backgroundColor: "#ffffff",
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: 15,
  },
  progressFill: {
    height: "100%",
    width: "0%",
    backgroundColor: COLORS.primary,
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
