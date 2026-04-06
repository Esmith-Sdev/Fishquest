import { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import { COLORS, RADIUS } from "../constants/theme";

export default function TimedChallengeModal({ show, onHide, challenge }) {
  const [timeLeft, setTimeLeft] = useState(challenge?.timeLimit ?? 0);
  const [start, setStart] = useState(false);

  useEffect(() => {
    setTimeLeft(challenge?.timeLimit ?? 0);
    setStart(false);
  }, [challenge]);

  useEffect(() => {
    if (!start || !challenge?.timeLimit) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const remaining = Math.max(prev - 1, 0);
        if (remaining <= 0) clearInterval(interval);
        return remaining;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [start, challenge]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  const percent = challenge?.timeLimit
    ? (timeLeft / challenge.timeLimit) * 100
    : 0;

  return (
    <Modal
      visible={show}
      transparent
      animationType="fade"
      onRequestClose={onHide}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{challenge?.title}</Text>

          <Text style={styles.time}>{formatTime(timeLeft)}</Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
          </View>

          <Text style={styles.body}>
            Once you click "Start" the challenge begins. You have one chance,
            good luck!
          </Text>

          {!start ? (
            <Pressable style={styles.button} onPress={() => setStart(true)}>
              <Text style={styles.buttonText}>Start</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.closeButton} onPress={onHide}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: RADIUS.md,
    padding: 20,
    gap: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
  time: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
  },
  progressTrack: {
    width: "100%",
    height: 12,
    backgroundColor: "#ddd",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  body: {
    color: "#000",
    textAlign: "center",
  },
  button: {
    alignSelf: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: "center",
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#000",
    fontWeight: "700",
  },
});
