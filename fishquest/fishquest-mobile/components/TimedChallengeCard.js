import { useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { COLORS, RADIUS } from "../constants/theme";
import TimedChallengeModal from "./TimedChallengeModal";

export default function TimedChallengeCard({ challenge, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
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
      {difficulty === "very hard" && (
        <Image
          source={require("../assets/images/icons/Crown.png")}
          style={styles.crown}
          resizeMode="contain"
        />
      )}
      <Text style={styles.xp}>+{challenge.rewardXp}XP</Text>

      <Text style={styles.title}>{challenge.title}</Text>

      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      <View style={styles.shadowWrapper}>
        <Pressable style={styles.button} onPress={() => setShowModal(true)}>
          <Text style={styles.buttonText}>Start</Text>
        </Pressable>
      </View>

      <TimedChallengeModal
        show={showModal}
        onHide={() => setShowModal(false)}
        challenge={challenge}
        onRefresh={onRefresh}
      />
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
    width: "0%",
    backgroundColor: COLORS.primary,
  },
  shadowWrapper: {
    marginTop: 2,
    alignSelf: "center",
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
