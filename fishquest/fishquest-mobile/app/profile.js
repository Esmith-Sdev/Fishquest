import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ScrollView,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import BottomNavbar from "../components/BottomNavbar";
import { Entypo } from "@expo/vector-icons";

import { COLORS, RADIUS } from "../constants/theme";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
import { useAuth } from "../context/AuthContext";
import SettingsModal from "../components/SettingsModal";
import LoadingIndicator from "../components/LoadingIndicator";
import AddBuddyModal from "../components/AddBuddyModal";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [openAddBuddyModal, setOpenAddBuddyModal] = useState(false);
  const [users, setUsers] = useState([]);
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    totalCatches: 0,
    favoriteBait: "None",
    skunkedCount: 0,
  });
  const { logout: authLogout } = useAuth();
  function getFavoriteBait(baits) {
    return (
      Object.entries(baits || {})
        .filter(([, count]) => Number(count) > 0)
        .sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0] || "None"
    );
  }
  async function fetchFriends() {
    try {
      const res = await fetch(`${API_URL}/api/buddies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchFriends();
  }, []);
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
              <Text style={styles.title}>Stats</Text>
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
          <Text style={styles.title}>Buddies</Text>
          <View style={styles.buddyContainer}>
            <FlatList
              data={users.slice(0, 3)}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              columnWrapperStyle={styles.gridRow}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.centerState}>
                  <Text style={styles.stateText}>No Buddies Found</Text>

                  <Pressable
                    style={styles.orangeButton}
                    onPress={() => setOpenAddBuddyModal(true)}
                  >
                    <Text style={styles.buttonText}>Add Buddy</Text>
                  </Pressable>
                </View>
              }
              renderItem={({ item }) => {
                return (
                  <Pressable
                    style={styles.card}
                    onPress={() =>
                      router.push({
                        pathname: "/buddyProfile",
                        params: {
                          buddyId: item._id,
                          username: item.username,
                        },
                      })
                    }
                  >
                    <View style={styles.cardBodyTop}>
                      <Text style={styles.cardTitle} numberOfLines={2}>
                        {item.username}
                      </Text>
                    </View>

                    <View style={styles.cardImage}>
                      <Image
                        style={styles.cardImage}
                        source={require("../assets/characters/MaleBasic/Male-Character-template-1.png")}
                      />
                    </View>
                  </Pressable>
                );
              }}
            />
            {users.length > 0 && (
              <Pressable
                style={styles.orangeButton}
                onPress={() => router.push("/buddies")}
              >
                <Text style={styles.buttonText}>View All Buddies</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.otherColumn}>
            <Text style={styles.title}>Tips/Tricks</Text>
            <View style={styles.tipsContainer}>
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
        <AddBuddyModal
          visible={openAddBuddyModal}
          onClose={() => setOpenAddBuddyModal(false)}
        />
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

  tipsContainer: {
    width: "80%",

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
    marginVertical: 20,
    flex: 1,

    alignItems: "center",
  },
  title: {
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
  buddyContainer: {
    backgroundColor: "#dedede",
    width: "90%",
    padding: 15,
    borderRadius: 15,
    display: "flex",
  },
  stateText: {
    color: "#000",
    fontSize: 18,
    fontFamily: "Jua",
    textAlign: "center",
  },
  subText: {
    color: "#000",
    fontSize: 14,
    textAlign: "center",
  },
  listContent: {
    padding: 12,
  },
  gridRow: {
    justifyContent: "center",
    gap: 20,
    marginBottom: 10,
  },
  card: {
    width: "30%",
    height: 100,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    alignItems: "center",
    overflow: "hidden",
    paddingVertical: 15,
    gap: 5,
  },
  cardBodyTop: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    paddingTop: 5,
    fontFamily: "Jua",
    fontSize: 10,
    color: "#000",
    textAlign: "center",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
    alignItems: "center",
  },
});
