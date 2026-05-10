import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
import BottomNavbar from "../components/BottomNavbar";
import { Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native";
import AddBuddyModal from "../components/AddBuddyModal";
import { COLORS, RADIUS } from "../constants/theme";
export default function Buddies() {
  const [openAddBuddyModal, setOpenAddBuddyModal] = useState(false);
  const friends = ["user1", "user2", "user3", "user4", "user5", "user6"];
  async function fetchFriendRequests() {
    const res = await fetch(`${API_URL}/api/friends/requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return data;
  }
  async function acceptFriendRequest(requestId) {
    const res = await fetch(
      `${API_URL}/api/friends/requests/${requestId}/accept`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();
    return data;
  }
  async function fetchFriends() {
    const res = await fetch(`${API_URL}/api/friends`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D1B1E" }}>
      <TopNavbarSecondary
        title="Buddies"
        buttonText="Add Buddy"
        showButton={true}
        onButtonPress={() => setOpenAddBuddyModal(true)}
        backRoute="/home"
      />
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <FlatList
            data={friends}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.centerState}>
                <Text style={styles.stateText}>
                  You don't have any buddies yet
                </Text>
                <Text style={styles.subText}>
                  Add some buddies to see them here.
                </Text>
                <Pressable style={styles.orangeButton}>
                  <Text style={styles.buttonText}>Add Buddy</Text>
                </Pressable>
              </View>
            }
            renderItem={({ item }) => {
              return (
                <Pressable style={styles.card}>
                  <View style={styles.cardBodyTop}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {item}
                    </Text>
                  </View>

                  <View style={styles.cardImage}>
                    <Entypo name="camera" size={24} color="black" />
                    <Text style={{ textAlign: "center", fontSize: 10 }}>
                      No Photo Available
                    </Text>
                  </View>

                  <View style={styles.cardBodyBottom}></View>
                </Pressable>
              );
            }}
          />
        </ScrollView>
        <BottomNavbar />
      </View>
      <AddBuddyModal
        visible={openAddBuddyModal}
        onClose={() => setOpenAddBuddyModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0D1B1E",
  },
  content: {
    paddingBottom: 100,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#F6A623",
    marginBottom: 10,
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#008575",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  cardPressable: {
    width: "90%",
  },
  horizontalCard: {
    width: "100%",
    height: 100,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  horizontalCardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Jua",
    color: "#fff",
    paddingHorizontal: 95,
  },
  sortRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 18,
    paddingHorizontal: 12,
  },
  deleteBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    elevation: 10,
  },
  sortLabel: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Jua",
  },
  content: {
    padding: 12,
    paddingBottom: 100,
  },
  centerState: {
    paddingVertical: 50,
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
  errorText: {
    color: "#ff7b7b",
    fontSize: 16,
    fontFamily: "Jua",
    textAlign: "center",
  },
  listContent: {
    padding: 12,
    paddingBottom: 100,
  },
  gridRow: {
    justifyContent: "space-between",
    marginBottom: 10,
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
  orangeButtonSmall: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
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
