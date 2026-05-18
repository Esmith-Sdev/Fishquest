import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/AuthContext";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
import BottomNavbar from "../components/BottomNavbar";
import LoadingIndicator from "../components/LoadingIndicator";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS } from "../constants/theme";
import {
  fetchBuddyProfile,
  fetchPreferences,
  toggleTrackedBuddy,
} from "../api/users";
import { fetchBuddyLogs } from "../api/logs";

export default function BuddyProfile() {
  const { token } = useAuth();
  const params = useLocalSearchParams();
  const buddyId = params?.buddyId;
  const usernameFromParams = params?.username;
  const [buddy, setBuddy] = useState({
    username: usernameFromParams || "Buddy",
  });
  const [tracking, setTracking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    totalCatches: 0,
    skunkedCount: 0,
    personalBest: 0,
  });

  useEffect(() => {
    async function loadBuddyData() {
      if (!token || !buddyId) {
        return;
      }

      setLoading(true);
      try {
        const [profileData, preferences, logs] = await Promise.all([
          fetchBuddyProfile(token, buddyId),
          fetchPreferences(token),
          fetchBuddyLogs(buddyId, token),
        ]);

        setBuddy(profileData);
        setTracking(
          Array.isArray(preferences.trackedBuddies) &&
            preferences.trackedBuddies.some(
              (id) => String(id) === String(buddyId),
            ),
        );

        const allLogs = Array.isArray(logs) ? logs : [];
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <TopNavbarSecondary
        title={buddy.username || "Buddy Profile"}
        backRoute="/buddies"
        showButton={false}
      />
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
              <Text style={styles.detailLabel}>Level</Text>
              <Text style={styles.detailValue}>{buddy.level || 1}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>XP</Text>
              <Text style={styles.detailValue}>{buddy.xp || 0}</Text>
            </View>
          </View>

          <Pressable
            onPress={handleTrackToggle}
            style={[styles.trackButton, saving && { opacity: 0.6 }]}
            disabled={saving}
          >
            <Text style={styles.trackButtonText}>
              {tracking ? "Stop Tracking" : "Track Buddy"}
            </Text>
          </Pressable>
        </ScrollView>
      )}
      <BottomNavbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: RADIUS.card,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
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
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    color: "#d3d3d3",
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
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: RADIUS.card,
    padding: 16,
    alignItems: "center",
  },
  statNumber: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
  },
  statLabel: {
    color: "#b0b0b0",
    fontSize: 14,
  },
  detailsCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: RADIUS.card,
    padding: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  detailLabel: {
    color: "#d3d3d3",
  },
  detailValue: {
    color: "#fff",
    fontWeight: "700",
  },
  trackButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 14,
    alignItems: "center",
  },
  trackButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
});
