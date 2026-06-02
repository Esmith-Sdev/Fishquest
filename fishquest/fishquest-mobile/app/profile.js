import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import BottomNavbar from "../components/BottomNavbar";
import { COLORS, RADIUS } from "../constants/theme";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
import { useAuth } from "../context/AuthContext";
import SettingsModal from "../components/SettingsModal";
import LoadingIndicator from "../components/LoadingIndicator";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

function getFavoriteBait(baits) {
  return (
    Object.entries(baits || {})
      .filter(([, count]) => Number(count) > 0)
      .sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0] || "None"
  );
}

export default function Profile() {
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
          favoriteBait: getFavoriteBait(data.baits),

          skunkedCount: data.skunkedCount || 0,
        });
      } catch {
        setStats((prev) => prev);
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchStats();
  }, [token]);
  const [showModal, setShowModal] = useState(false);

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
        <View
          style={{
            width: "100%",
            alignItems: "flex-end",
            padding: 15,
            paddingBottom: 0,
          }}
        >
          <Pressable
            style={styles.iconButton}
            onPress={() => router.push("/buddies")}
          >
            <FontAwesome5 name="user-friends" size={20} color="#fff" />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
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
        </ScrollView>

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
    height: 320,
    marginTop: 20,
    padding: 20,
    backgroundColor: "#dedede",
    borderRadius: 15,
    boxShadow: "0 4px 0 #747474",
  },
  content: {
    padding: 16,
    paddingBottom: 110,
    alignItems: "center",
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
    minHeight: 120,
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
  iconButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 9999,
    padding: 10,
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
  tipsColumn: {
    flexDirection: "column",
    gap: 20,
    alignItems: "center",
  },
});
