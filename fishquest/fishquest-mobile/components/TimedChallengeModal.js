import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { COLORS, RADIUS } from "../constants/theme";
import { router } from "expo-router";
import { getToken } from "../api/auth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function getEndsAt(startedAt, timeLimit) {
  if (!startedAt || !timeLimit) return null;
  return new Date(startedAt).getTime() + timeLimit * 1000;
}

function getSecondsLeft(endsAt, fallback) {
  if (!endsAt) return fallback ?? 0;
  return Math.max(Math.ceil((endsAt - Date.now()) / 1000), 0);
}

async function ensureChallengeNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

async function configureChallengeNotificationChannel() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("timed-challenges", {
    name: "Timed Challenges",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
}

async function scheduleChallengeNotifications(challenge, endsAt) {
  const hasPermission = await ensureChallengeNotificationPermissions();
  if (!hasPermission) {
    throw new Error("Notification permission not granted.");
  }

  await configureChallengeNotificationChannel();

  const title = challenge?.title || "Timed Challenge";
  const endsAtLabel = new Date(endsAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const runningId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "FishQuest challenge running",
      body: `${title} ends at ${endsAtLabel}.`,
      data: {
        type: "timed-challenge-running",
        challengeId: challenge?.userChallengeId,
        endsAt,
      },
      sound: "default",
    },
    trigger: null,
  });

  const finishedId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Challenge time's up",
      body: `${title} has ended.`,
      data: {
        type: "timed-challenge-ended",
        challengeId: challenge?.userChallengeId,
      },
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(endsAt),
      channelId: "timed-challenges",
    },
  });

  return [runningId, finishedId];
}

export default function TimedChallengeModal({
  show,
  onHide,
  challenge,
  onRefresh,
}) {
  const API_URL = "https://fishquest.onrender.com";
  const [now, setNow] = useState(Date.now());
  const [endsAt, setEndsAt] = useState(() =>
    getEndsAt(challenge?.startedAt, challenge?.timeLimit),
  );
  const [start, setStart] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [notificationIds, setNotificationIds] = useState([]);
  async function startChallenge() {
    try {
      const result = await startChallengeCooldown(challenge.userChallengeId);
      const nextEndsAt = getEndsAt(result.startedAt, challenge.timeLimit);

      if (!nextEndsAt) {
        throw new Error("Challenge timer is missing a start or end time.");
      }

      setEndsAt(nextEndsAt);
      setStart(true);
      setNow(Date.now());

      try {
        const ids = await scheduleChallengeNotifications(challenge, nextEndsAt);
        setNotificationIds(ids);
      } catch (_notificationError) {
        Alert.alert(
          "Notifications Off",
          "The challenge timer started, but FishQuest cannot show it on your lock screen without notification permission.",
        );
      }

      await onRefresh();
    } catch {
      setStart(false);
    }
  }

  async function startChallengeCooldown(userChallengeId) {
    const token = await getToken();

    const res = await fetch(
      `${API_URL}/api/challenges/${userChallengeId}/start`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) throw new Error("Failed to start challenge");

    return res.json();
  }
  async function forfeitChallenge(userChallengeId) {
    const token = await getToken();

    const res = await fetch(
      `${API_URL}/api/challenges/${userChallengeId}/forfeit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error("Failed to forfeit challenge");
    }
    await Promise.all(
      notificationIds.flatMap((id) => [
        Notifications.cancelScheduledNotificationAsync(id).catch(() => null),
        Notifications.dismissNotificationAsync(id).catch(() => null),
      ]),
    );
    setNotificationIds([]);
    await onRefresh();
    onHide();
    setOpenConfirm(false);
    return res.json();
  }
  useEffect(() => {
    if (!show) return;

    const activeEndsAt = getEndsAt(challenge?.startedAt, challenge?.timeLimit);
    const isActive = getSecondsLeft(activeEndsAt, 0) > 0;

    setEndsAt(activeEndsAt);
    setNow(Date.now());
    setStart(isActive);
    setOpenConfirm(false);
  }, [
    show,
    challenge?.startedAt,
    challenge?.timeLimit,
    challenge?.userChallengeId,
  ]);

  useEffect(() => {
    if (!start || !endsAt) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [start, endsAt]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  const timeLeft = endsAt
    ? Math.max(Math.ceil((endsAt - now) / 1000), 0)
    : (challenge?.timeLimit ?? 0);
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
          {!start && (
            <View style={{ position: "absolute", right: 15, top: 10 }}>
              <TouchableOpacity onPress={onHide} style={styles.button}>
                <MaterialIcons
                  name="cancel"
                  size={30}
                  color={COLORS.secondary}
                />{" "}
              </TouchableOpacity>
            </View>
          )}
          {!openConfirm ? (
            <>
              <Text style={styles.title}>{challenge?.title}</Text>

              <Text style={styles.time}>{formatTime(timeLeft)}</Text>

              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${percent}%` }]} />
              </View>

              <Text style={styles.body}>
                Once you click &quot;Start&quot; the challenge begins. You have
                one chance, good luck!
              </Text>

              {!start ? (
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => startChallenge()}
                >
                  <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.startButton}
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
                    <Text style={styles.buttonText}>Log Challenge</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setOpenConfirm(true)}
                  >
                    <Text style={styles.buttonText}>Forfeit Challenge</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 30,
                flex: 1,
              }}
            >
              <Text style={styles.title}>Are You Sure?</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => forfeitChallenge(challenge.userChallengeId)}
                >
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setOpenConfirm(false);
                  }}
                >
                  <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: RADIUS.md,
    padding: 20,
    gap: 14,
    height: 250,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
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

  startButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,

    alignSelf: "center",
    shadowColor: COLORS.primaryDropShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
  },
  closeButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: COLORS.primaryDropShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
  },
  buttonText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 15,
    textAlign: "center",
  },
});
