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
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/friends/search?query=${encodeURIComponent(searchText)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      setUsers(data);
    } catch (error) {
      console.log("Search users error:", error);
      setMessage("Could not search users.");
    } finally {
      setSearching(false);
    }
  }

  async function handleAddFriend(receiverId) {
    const res = await fetch(`${API_URL}/api/friends/request/${receiverId}`, {
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
                data={users}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View>
                    <Text>{item.username}</Text>

                    <Pressable onPress={() => handleAddFriend(item._id)}>
                      <Text>Add Friend</Text>
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
  },
  searchText: {
    fontSize: 14,
    fontFamily: "Rubik",
  },
  tempText: {
    fontSize: 30,
    fontFamily: "Rubik",
  },
  weatherText: {
    fontSize: 15,
    fontFamily: "Rubik",
  },
  windText: {
    fontSize: 15,
    fontFamily: "Rubik",
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
  },
  modalCard: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    height: 300,
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

  orangeButton: {
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
