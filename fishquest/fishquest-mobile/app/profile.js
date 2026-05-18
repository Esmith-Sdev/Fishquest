import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image, Alert } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavbar from "../components/BottomNavbar";
import { COLORS, RADIUS } from "../constants/theme";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
import { useAuth } from "../context/AuthContext";
import SettingsModal from "../components/SettingsModal";
import LoadingIndicator from "../components/LoadingIndicator";
const API_URL = process.env.EXPO_PUBLIC_API_URL;
export default function Profile() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    totalCatches: 0,
    favoriteBait: "None",
    skunkedCount: 0,
  });
  const { logout: authLogout } = useAuth();

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${API_URL}/api/user-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setStats({
          totalCatches: data.totalCatches || 0,
          personalBest: data.personalBest || 0,
          challengesCompleted: data.challengesCompleted || 0,
          favoriteBait:
            Object.entries(data.baits || {}).sort(
              (a, b) => b[1] - a[1],
            )[0]?.[0] || "None",

          skunkedCount: data.skunkedCount || 0,
        });
      } catch (err) {
        console.log("Failed to fetch profile stats", err);
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchStats();
  }, [token]);
  const [showModal, setShowModal] = useState(false);

  const titles = [
    "Minnow Wrangler",
    "Pond Rookie",
    "Bobber Buddy",
    "Reel Recruit",
    "Hook Apprentice",
    "Line Caster",
    "Bait Specialist",
    "Tackle Technician",
    "Lure Adept",
    "Dock Adventurer",
    "Shoreline Scout",
    "River Ranger",
    "Lake Legend",
    "Deepwater Pro",
    "Tide Tamer",
    "Master Angler",
    "Mythic Fisher",
    "King of the Catch",
    "Reelmaster Supreme",
    "Fish God",
  ];

  const rank = 1;
  const rankTitle = titles[rank - 1];
  const xp = 60;

  function handleLogout() {
    logout();
    router.replace("/login");
  }
  function openModal() {
    setShowModal(true);
  }
  function closeModal() {
    setShowModal(false);
  }
  async function handleLogout() {
    await authLogout();
    router.replace("/login");
  }
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
        <View style={styles.screen}>
          <TopNavbarSecondary
            title="Profile"
            buttonText="Settings"
            onButtonPress={openModal}
            showButton={true}
            backRoute="/home"
          />

          <View style={styles.centerState}>
            <LoadingIndicator text="Loading Profile" color="#fff" />
          </View>

          <BottomNavbar />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View style={styles.screen}>
        <SettingsModal
          visible={showModal}
          onClose={closeModal}
          onLogOut={handleLogout}
        />
        <TopNavbarSecondary
          title="Profile"
          buttonText="Settings"
          onButtonPress={openModal}
          showButton={true}
          backRoute="/home"
        />
        <View style={styles.content}>
          <View style={styles.profileRow}>
            <View style={styles.leftColumn}>
              <Text style={styles.username}>{user?.username || "User"}</Text>
              <View style={styles.profileImageContainer}>
                <Image
                  style={styles.profileImage}
                  source={require("../assets/characters/Male Basic/Male-Character-template-1.png")}
                />
              </View>
              <Pressable
                style={styles.orangeButton}
                onPress={() =>
                  Alert.alert(
                    "Feature Unavailable",
                    "This is not available in beta yet.",
                  )
                }
              >
                <Text style={styles.buttonText}>Customize</Text>
              </Pressable>
            </View>
            <View style={styles.statsColumn}>
              <Text style={styles.statsTitle}>Stats</Text>
              <View style={styles.statsTextColumn}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Personal Best:</Text>
                  <Text style={styles.statValue}>{stats.personalBest}lb</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Fish Caught:</Text>
                  <Text style={styles.statValue}>{stats.totalCatches}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Challenges Completed:</Text>
                  <Text style={styles.statValue}>
                    {stats.challengesCompleted}
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Favorite Bait:</Text>
                  <Text style={styles.statValue}>
                    {stats.favoriteBait
                      .replaceAll("_", " ")
                      .toString()
                      .charAt(0)
                      .toUpperCase() +
                      stats.favoriteBait
                        .replaceAll("_", " ")
                        .toString()
                        .slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.otherColumn}>
            <View style={styles.tipsContainer}>
              <Text style={styles.title}>Tips/Tricks</Text>
              <View style={styles.tipsColumn}>
                <Pressable
                  style={styles.blueButton}
                  onPress={() =>
                    Alert.alert(
                      "Feature Unavailable",
                      "This is not available in beta yet.",
                    )
                  }
                >
                  <Text style={styles.buttonText}>Popular Rig Setups</Text>
                </Pressable>
                <Pressable
                  style={styles.blueButton}
                  onPress={() =>
                    Alert.alert(
                      "Feature Unavailable",
                      "This is not available in beta yet.",
                    )
                  }
                >
                  <Text style={styles.buttonText}>
                    Fishing Different Species
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.blueButton}
                  onPress={() =>
                    Alert.alert(
                      "Feature Unavailable",
                      "This is not available in beta yet.",
                    )
                  }
                >
                  <Text style={styles.buttonText}>Choosing the Right Rig</Text>
                </Pressable>
                <Pressable
                  style={styles.blueButton}
                  onPress={() =>
                    Alert.alert(
                      "Feature Unavailable",
                      "This is not available in beta yet.",
                    )
                  }
                >
                  <Text style={styles.buttonText}>Snag Preventers</Text>
                </Pressable>
                <Pressable
                  style={styles.blueButton}
                  onPress={() =>
                    Alert.alert(
                      "Feature Unavailable",
                      "This is not available in beta yet.",
                    )
                  }
                >
                  <Text style={styles.buttonText}>
                    How to Use Different Lures
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <BottomNavbar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0D1B1E",
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Jua",
    color: "#000",
    textDecorationLine: "underline",
    marginBottom: 15,
  },
  tipsContainer: {
    width: "90%",
    marginTop: 20,
    padding: 20,
    backgroundColor: "#dedede",
    borderRadius: 15,
    boxShadow: "0 4px 0 #747474",
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  },
  profileRow: {
    flexDirection: "row",

    marginBottom: 20,
    alignItems: "flex-start",
  },
  leftColumn: {
    flex: 1,
    alignItems: "center",
  },
  statsTextColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  username: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "Jua",
    marginBottom: 8,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  profileImageContainer: {
    width: 130,
    height: 130,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    marginBottom: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "125%",
    height: "125%",
  },
  statsColumn: {
    flex: 1,
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  otherColumn: {
    flex: 1,
    gap: 12,
    alignItems: "center",
  },
  statsTitle: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "Jua",
    textAlign: "center",
    textDecorationLine: "underline",
    marginBottom: 8,
  },
  statRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: "#fff",
    fontFamily: "Jua",
    fontSize: 18,
  },
  statLabel: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Jua",
  },
  statValue: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Jua",
  },
  rankContainer: {
    marginTop: 24,
    padding: 16,
    width: "100%",
  },
  rankText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Jua",
    textAlign: "center",
    marginBottom: 8,
  },
  progressTrack: {
    width: "100%",
    height: 18,
    backgroundColor: "#d9d9d9",
    borderRadius: 999,
    overflow: "hidden",
    justifyContent: "center",
    borderColor: "#000",
    borderWidth: 1,
    position: "relative",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.secondary,
    borderRadius: 999,
  },
  progressLabel: {
    textAlign: "center",
    fontSize: 11,
    color: "#000",
    fontFamily: "Jua",
  },
  levelText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Jua",
    textAlign: "center",
    marginTop: 8,
  },
  orangeButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,

    paddingHorizontal: 12,
    boxShadow: "0px 4px 0px #733800",
    shadowColor: COLORS.secondaryDropShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
  },
  blueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    width: 250,
    paddingHorizontal: 30,
    boxShadow: "0px 4px 0px #003f73",
    shadowColor: COLORS.primaryDropShadow,
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
    fontSize: 16,
    fontFamily: "Jua",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: "Jua",
    color: "#000",
  },
  modalBody: {
    minHeight: 40,
    marginTop: 10,
  },
  modalFooter: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  tipsColumn: {
    flexDirection: "column",
    gap: 20,
    alignItems: "center",
  },
});
