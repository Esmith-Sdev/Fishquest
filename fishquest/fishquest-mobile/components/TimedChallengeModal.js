import { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import { COLORS, RADIUS } from "../constants/theme";
import { getToken } from "../api/auth";
export default function TimedChallengeModal({
  show,
  onHide,
  challenge,
  onRefresh,
}) {
  const [timeLeft, setTimeLeft] = useState(challenge?.timeLimit ?? 0);
  const [start, setStart] = useState(false);
  const API_URL = "https://fishquest.onrender.com";
  async function startChallenge() {
    try {
      await startChallengeCooldown(challenge.userChallengeId);
      setStart(true);
      await onRefresh();
    } catch (err) {
      console.error(err);
    }
  }
  async function startChallengeCooldown(userChallengeId) {
    const token = await getToken();

    const res = await fetch(
      `${API_URL}/api/challenges/${userChallengeId}/start`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) throw new Error("Failed to start challenge");

    return res.json();
  }
  async function forfeitChallenge() {
    try {
      await startChallengeCooldown(challenge.userChallengeId);
      onHide();
      await onRefresh();
    } catch (err) {
      console.error("Failed to forfeit challenge:", err);
    }
  }
  useEffect(() => {
    if (!show) return;

    setTimeLeft(challenge?.timeLimit ?? 0);
    setStart(false);
  }, [show, challenge?.userChallengeId]);

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
            <Pressable
              style={styles.startButton}
              onPress={() => startChallenge()}
            >
              <Text style={styles.buttonText}>Start</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.closeButton} onPress={forfeitChallenge}>
              <Text style={styles.buttonText}>Forfeit Challenge</Text>
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
  startButton: {
    alignSelf: "center",
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#000",
    fontWeight: "700",
  },
});
