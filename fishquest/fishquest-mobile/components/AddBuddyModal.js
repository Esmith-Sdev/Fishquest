import { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, RADIUS } from "../constants/theme";
import { getCurrentLocation } from "../utils/getCurrentLocation";
import { ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
const API_URL = process.env.EXPO_PUBLIC_API_URL;
export default function AddBuddyModal({ visible, onClose }) {
  const { token } = useAuth();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  async function handleSearch(text = query) {
    setSearching(true);
    const searchText = String(text || "");

    setQuery(searchText);

    if (searchText.trim().length < 2) {
      setUsers([]);
      setSearching(false);
      return;
    }
    try {
      const res = await fetch(
        `${API_URL}/api/buddies/search?query=${encodeURIComponent(searchText)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("STATUS:", res.status);
      const data = await res.json();
      console.log("DATA:", data);

      setUsers(Array.isArray(data) ? data : []);
      setUsers(data);
    } catch (error) {
      console.log("Search users error:", error);
      setMessage("Could not search users.");
    } finally {
      setSearching(false);
    }
  }

  async function handleAddFriend(receiverId) {
    const res = await fetch(`${API_URL}/api/buddies/request/${receiverId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setMessage(data.message || "Friend request sent.");
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} style={styles.overlay}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={styles.modalCard}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Add a Buddy</Text>
            <View style={{ position: "absolute", right: -10, top: -10 }}>
              <Pressable onPress={onClose} style={styles.button}>
                <MaterialIcons
                  name="cancel"
                  size={30}
                  color={COLORS.secondary}
                />{" "}
              </Pressable>
            </View>
          </View>
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <View style={styles.column}>
              <View style={styles.searchBar}>
                <TextInput
                  placeholder="Enter a username..."
                  style={styles.searchText}
                  value={query}
                  onChangeText={handleSearch}
                />
              </View>
              <Pressable
                style={styles.orangeButton}
                onPress={() => handleSearch(query)}
              >
                <Text style={styles.buttonText}>
                  {searching ? "Searching..." : "Search"}
                </Text>
              </Pressable>
              {message ? <Text>{message}</Text> : null}

              <FlatList
                style={{ width: "100%" }}
                data={users}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.column}>
                    <View style={styles.userContainer}>
                      <Text style={styles.usernameText}>{item.username}</Text>
                    </View>
                    <Pressable
                      style={styles.blueButton}
                      onPress={() => handleAddFriend(item._id)}
                    >
                      <Text style={styles.buttonText}>Add</Text>
                    </Pressable>
                  </View>
                )}
              />
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  locationText: {
    fontSize: 14,
    fontFamily: "Rubik",
  },
  searchBar: {
    width: "100%",
    borderRadius: 999,
    borderColor: "#c5c5c5",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 1,
    marginTop: 20,
    marginBottom: 10,
  },
  searchText: {
    fontSize: 14,
    fontFamily: "Rubik",
  },
  userContainer: {
    width: 130,
    height: 130,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    marginBottom: 12,
    overflow: "hidden",
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
  },
  usernameText: {
    fontSize: 16,
    top: -10,
    fontFamily: "Jua",
  },
  column: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  modalCard: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    height: 400,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#dedede",
  },
  title: {
    fontSize: 18,
    fontFamily: "Jua",
    paddingBottom: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 25,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#dedede",
  },
  orangeButton: {
    boxShadow: "0px 4px 0px #733800",

    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: COLORS.secondaryDropShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
    zIndex: 10,
  },
  weatherImage: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    marginTop: 16,
  },
  blueButton: {
    backgroundColor: COLORS.primary,
    boxShadow: "0px 4px 0px #003f73",
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: COLORS.primaryDropShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
    zIndex: 10,
  },
  buttonText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 15,
    textAlign: "center",
  },
});
