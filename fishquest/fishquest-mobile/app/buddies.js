import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
import BottomNavbar from "../components/BottomNavbar";
import { Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import AddBuddyModal from "../components/AddBuddyModal";
import { COLORS, RADIUS } from "../constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import LoadingIndicator from "../components/LoadingIndicator";
import BuddyRequestsModal from "../components/BuddyRequestsModal";
const API_URL = process.env.EXPO_PUBLIC_API_URL;
export default function Buddies() {
  const { token } = useAuth();

  const [openAddBuddyModal, setOpenAddBuddyModal] = useState(false);
  const [openBuddyRequestsModal, setOpenBuddyRequestsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  async function fetchFriendRequests() {
    try {
      const res = await fetch(`${API_URL}/api/buddies/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setRequests(Array.isArray(data) ? data : []);
    } catch {
      setRequests([]);
    }
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
    fetchFriendRequests();
    fetchFriends();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View style={styles.screen}>
        <TopNavbarSecondary
          title="Buddies"
          buttonText="Add Buddy"
          showButton={true}
          onButtonPress={() => setOpenAddBuddyModal(true)}
          backRoute="/home"
        />
        {loading ? (
          <View style={styles.centerState}>
            <LoadingIndicator text="Loading Buddies" color="#fff" />
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.content}>
              <View style={styles.notificationContainer}>
                <TouchableOpacity
                  style={styles.notificationButton}
                  onPress={() => setOpenBuddyRequestsModal(true)}
                >
                  <View style={styles.notificationRow}>
                    <Ionicons
                      name="notifications"
                      size={30}
                      color={COLORS.secondary}
                    />
                    <View
                      style={{
                        width: 25,
                        height: 25,
                        padding: 4,
                        top: -10,
                        borderRadius: 9999,
                        backgroundColor: COLORS.secondary,
                      }}
                    >
                      <Text style={styles.notificationText}>
                        {requests.length}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <FlatList
                data={users}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                columnWrapperStyle={styles.gridRow}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                  <View style={styles.centerState}>
                    <Text style={styles.stateText}>
                      You do not have any buddies yet
                    </Text>
                    <Text style={styles.subText}>
                      Add some buddies to see them here.
                    </Text>
                    <TouchableOpacity
                      style={styles.orangeButton}
                      onPress={() => setOpenAddBuddyModal(true)}
                    >
                      <Text style={styles.orangeButtonText}>Add Buddy</Text>
                    </TouchableOpacity>
                  </View>
                }
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
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

                      <View style={styles.cardBodyBottom}></View>
                    </TouchableOpacity>
                  );
                }}
              />
            </ScrollView>
          </>
        )}
        <BottomNavbar />
      </View>
      <AddBuddyModal
        visible={openAddBuddyModal}
        onClose={() => setOpenAddBuddyModal(false)}
      />
      <BuddyRequestsModal
        visible={openBuddyRequestsModal}
        onClose={() => setOpenBuddyRequestsModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0D1B1E",
  },
  notificationRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  notificationText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Rubik",
    fontSize: 12,
  },

  content: {
    padding: 12,
    paddingBottom: 100,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  stateText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Jua",
    textAlign: "center",
  },
  subText: {
    color: "#ddd",
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
  orangeButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 5,
    paddingHorizontal: 10,
    minWidth: 92,
    shadowColor: COLORS.secondaryDropShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
  },
  orangeButtonText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 14,
    textAlign: "center",
  },
});
