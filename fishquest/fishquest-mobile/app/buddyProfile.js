import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { useAuth } from "../context/AuthContext";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
import BottomNavbar from "../components/BottomNavbar";
import ConfirmModal from "../components/ConfirmModal";
import LoadingIndicator from "../components/LoadingIndicator";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS } from "../constants/theme";
import {
  fetchBuddyProfile,
  fetchBuddyStats,
  fetchPreferences,
  removeBuddy,
  toggleTrackedBuddy,
} from "../api/users";
import { fetchBuddyLogs } from "../api/logs";
import skunkImage from "../assets/images/Fish/skunked.png";

export default function BuddyProfile() {
  const { token } = useAuth();
  const params = useLocalSearchParams();
  const buddyId = params?.buddyId;
  const usernameFromParams = params?.username;
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [buddy, setBuddy] = useState({
    username: usernameFromParams || "Buddy",
  });
  const [tracking, setTracking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [buddyLogs, setBuddyLogs] = useState([]);
  const [stats, setStats] = useState({
    totalCatches: 0,
    skunkedCount: 0,
    personalBest: 0,
    favoriteBait: "None",
    challengesCompleted: 0,
  });

  useEffect(() => {
    async function loadBuddyData() {
      if (!token || !buddyId) {
        return;
      }

      setLoading(true);
      try {
        const [profileData, preferences, logs, statsData] = await Promise.all([
          fetchBuddyProfile(token, buddyId),
          fetchPreferences(token),
          fetchBuddyLogs(buddyId, token),
          fetchBuddyStats(token, buddyId),
        ]);

        setBuddy(profileData);
        setTracking(
          Array.isArray(preferences.trackedBuddies) &&
            preferences.trackedBuddies.some(
              (id) => String(id) === String(buddyId),
            ),
        );

        const allLogs = Array.isArray(logs) ? logs : [];
        setBuddyLogs(allLogs);
        const favoriteBait =
          Object.entries(statsData.baits || {}).sort(
            (a, b) => b[1] - a[1],
          )[0]?.[0] || "None";
        const skunkedCount = allLogs.filter((log) => log.skunked).length;
        const fishLogs = allLogs.filter((log) => !log.skunked);
        const personalBest = fishLogs.reduce(
          (best, log) => Math.max(best, Number(log.weight) || 0),
          0,
        );

        setStats({
          totalCatches: fishLogs.length,
          skunkedCount,
          personalBest,

          favoriteBait,
          challengesCompleted: statsData.challengesCompleted || 0,
        });
      } catch (error) {
        Alert.alert("Error", error.message || "Could not load buddy profile.");
      } finally {
        setLoading(false);
      }
    }

    loadBuddyData();
  }, [token, buddyId, usernameFromParams]);

  async function handleTrackToggle() {
    if (!token || !buddyId) {
      return Alert.alert("Error", "Unable to update buddy tracking.");
    }

    setSaving(true);
    try {
      await toggleTrackedBuddy(token, buddyId, !tracking);
      setTracking((prev) => !prev);
      Alert.alert(
        tracking ? "Tracking Stopped" : "Tracking Enabled",
        tracking
          ? "You will no longer receive notifications for this buddy."
          : "You will now receive notifications when this buddy logs a catch.",
      );
    } catch (error) {
      Alert.alert("Error", error.message || "Could not update tracking.");
    } finally {
      setSaving(false);
    }
  }

  function getImageSource(photo) {
    return typeof photo === "string" ? { uri: photo } : photo;
  }

  async function handleRemoveBuddy() {
    if (!token || !buddyId) {
      return Alert.alert("Error", "Unable to remove buddy.");
    }

    setSaving(true);
    try {
      await removeBuddy(token, buddyId);
      setOpenConfirmModal(false);
      Alert.alert("Buddy Removed", "This buddy has been removed.", [
        { text: "OK", onPress: () => router.replace("/buddies") },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message || "Could not remove buddy.");
    } finally {
      setSaving(false);
    }
  }

  if (!buddyId) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
        <TopNavbarSecondary
          title="Buddy Profile"
          backRoute="/buddies"
          showButton={false}
        />
        <View style={styles.centerState}>
          <Text style={styles.errorText}>Buddy not selected.</Text>
        </View>
        <BottomNavbar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View style={styles.screen}>
        <TopNavbarSecondary
          title={buddy.username || "Buddy Profile"}
          backRoute="/buddies"
          showButton={false}
        />
        <BottomNavbar />

        {loading ? (
          <View style={styles.centerState}>
            <LoadingIndicator text="Loading Buddy" color="#fff" />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.profileCard}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {buddy.username?.charAt(0).toUpperCase() || "B"}
                </Text>
              </View>
              <Text style={styles.username}>{buddy.username}</Text>
              <Text style={styles.subtitle}>
                {buddy.levelTitle || "Fishing Friend"}
              </Text>
            </View>
            <View style={styles.buttonsContainer}>
              <Pressable
                onPress={handleTrackToggle}
                style={[styles.trackButton, saving && { opacity: 0.6 }]}
                disabled={saving}
              >
                <Text style={styles.trackButtonText}>
                  {tracking ? "Stop Tracking" : "Track Buddy"}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setOpenConfirmModal(true)}
                style={[styles.removeButton, saving && { opacity: 0.6 }]}
                disabled={saving}
              >
                <Text style={styles.trackButtonText}>Remove Buddy</Text>
              </Pressable>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statBlock}>
                <Text style={styles.statNumber}>{stats.totalCatches}</Text>
                <Text style={styles.statLabel}>Catches</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.statNumber}>{stats.skunkedCount}</Text>
                <Text style={styles.statLabel}>Skunked</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.statNumber}>{stats.personalBest}</Text>
                <Text style={styles.statLabel}>Best Weight</Text>
              </View>
            </View>
            <View style={styles.detailsCard}>
              <Text style={styles.sectionTitle}>Buddy Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Favorite Bait</Text>
                <Text style={styles.detailValue}>
                  {stats.favoriteBait
                    .replaceAll("_", " ")
                    .charAt(0)
                    .toUpperCase() +
                    stats.favoriteBait.replaceAll("_", " ").slice(1)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Challenges Completed</Text>
                <Text style={styles.detailValue}>
                  {stats.challengesCompleted || 0}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Level</Text>
                <Text style={styles.detailValue}>{buddy.level || 1}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>XP</Text>
                <Text style={styles.detailValue}>{buddy.xp || 0}</Text>
              </View>
            </View>
            <View style={styles.logsSection}>
              <Text style={styles.logsTitle}>Logs</Text>
              {buddyLogs.length ? (
                <View style={styles.logsGrid}>
                  {buddyLogs.map((log) => {
                    const title = log.skunked
                      ? "Skunked Trip"
                      : log.speciesName || "Unknown Fish";
                    const photo = log.skunked ? skunkImage : log.imageUrls?.[0];
                    const formattedDate = log.date
                      ? new Date(log.date).toLocaleDateString()
                      : "";

                    return (
                      <Pressable
                        style={styles.card}
                        key={log._id}
                        onPress={() =>
                          router.push({
                            pathname: "/view-log",
                            params: {
                              id: log._id,
                              source: "buddy",
                              buddyId,
                              username: buddy.username,
                            },
                          })
                        }
                      >
                        <View style={styles.cardBodyTop}>
                          <Text style={styles.cardTitle} numberOfLines={2}>
                            {title}
                          </Text>
                        </View>

                        {photo ? (
                          <Image
                            source={getImageSource(photo)}
                            style={styles.cardImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={styles.cardImage}>
                            <Entypo name="camera" size={24} color="black" />
                            <Text
                              style={{
                                textAlign: "center",
                                fontSize: 10,
                              }}
                            >
                              No Photo Available
                            </Text>
                          </View>
                        )}

                        <View style={styles.cardBodyBottom}>
                          <Text style={styles.cardSubtitle}>
                            {formattedDate}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.emptyLogs}>
                  <Text style={styles.emptyLogsText}>No logs yet</Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}
        <ConfirmModal
          title="Are you sure?"
          visible={openConfirmModal}
          onConfirm={handleRemoveBuddy}
          onCancel={() => {
            setOpenConfirmModal(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0D1B1E",
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
  },
  profileCard: {
    backgroundColor: COLORS.primary,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 15,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: "#000",
    fontSize: 32,
    fontWeight: "700",
  },
  username: {
    fontFamily: "Jua",
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: "Jua",
    color: "#dedede",
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  statBlock: {
    flex: 1,
    backgroundColor: "#dedede",
    borderRadius: 15,
    padding: 16,
    alignItems: "center",
  },
  statNumber: {
    color: "#000",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
  },
  statLabel: {
    color: "#222222",
    fontSize: 14,
  },
  detailsCard: {
    backgroundColor: "#dedede",
    padding: 18,
    borderRadius: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#222",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
  },
  detailLabel: {
    color: "#222",
  },
  detailValue: {
    color: "#000",
    fontWeight: "700",
  },
  logsSection: {
    marginBottom: 20,
  },
  logsTitle: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "Jua",
    textAlign: "center",
    textDecorationLine: "underline",
    marginBottom: 12,
  },
  logsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  card: {
    width: "31%",
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    alignItems: "center",
    overflow: "hidden",
    paddingVertical: 8,
    position: "relative",
  },
  cardBodyTop: {
    width: "100%",
    paddingHorizontal: 6,
    minHeight: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  cardBodyBottom: {
    width: "100%",
    paddingHorizontal: 6,
    paddingTop: 4,
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: "Jua",
    fontSize: 10,
    color: "#000",
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 10,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: 15,
    marginVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyLogs: {
    backgroundColor: "#dedede",
    borderRadius: 15,
    padding: 18,
    alignItems: "center",
  },
  emptyLogsText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 16,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  trackButton: {
    backgroundColor: COLORS.primary,
    boxShadow: "0px 4px 0px #003f73",
    borderRadius: RADIUS.pill,
    paddingVertical: 14,

    width: 150,
    alignItems: "center",
  },
  removeButton: {
    boxShadow: "0px 4px 0px #733800",
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 14,
    width: 150,

    alignItems: "center",
  },
  trackButtonText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 18,
    textAlign: "center",
  },
});
