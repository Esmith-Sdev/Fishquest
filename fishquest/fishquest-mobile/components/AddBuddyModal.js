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
import { useAuth } from "../context/AuthContext";
import LoadingIndicator from "./LoadingIndicator";
const API_URL = process.env.EXPO_PUBLIC_API_URL;
export default function AddBuddyModal({ visible, onClose }) {
  const { token } = useAuth();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [addedUsers, setAddedUsers] = useState({});
  const [addingUserId, setAddingUserId] = useState(null);
  const [resultMessage, setResultMessage] = useState("");
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
      const data = await res.json();

      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setMessage("Could not search users.");
    } finally {
      setSearching(false);
    }
  }

  async function handleAddFriend(receiverId) {
    try {
      setAddingUserId(receiverId);

      const res = await fetch(`${API_URL}/api/buddies/request/${receiverId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setAddedUsers((prev) => ({
        ...prev,
        [receiverId]: true,
      }));

      setResultMessage(data.message || "Friend request sent!");
    } catch {
      setResultMessage("Could not send friend request.");
    } finally {
      setAddingUserId(null);
    }
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
            <LoadingIndicator text="Searching" color="#fff" />
          ) : (
            <View style={styles.column}>
              <View style={styles.searchBar}>
                <TextInput
                  placeholder="Enter a username..."
                  style={styles.searchText}
                  value={query}
                  onChangeText={setQuery}
                />
              </View>
              <Pressable
                style={[styles.orangeButton, { marginBottom: 15 }]}
                onPress={() => handleSearch(query)}
              >
                <Text style={styles.buttonText}>
                  {searching ? "Searching..." : "Search"}
                </Text>
              </Pressable>
              {resultMessage ? (
                <View style={styles.messageBox}>
                  <Text style={styles.buttonText}>{resultMessage}</Text>

                  <Pressable
                    style={styles.orangeButton}
                    onPress={() => setResultMessage("")}
                  >
                    <Text style={styles.buttonText}>OK</Text>
                  </Pressable>
                </View>
              ) : (
                <FlatList
                  style={styles.list}
                  data={users}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <View style={styles.row}>
                      <View style={styles.userContainer}>
                        <Text style={styles.usernameText}>{item.username}</Text>
                      </View>

                      {addingUserId === item._id ? (
                        <ActivityIndicator
                          size="small"
                          color={COLORS.primary}
                        />
                      ) : addedUsers[item._id] ? (
                        <Pressable style={styles.blueButton} disabled>
                          <Text style={styles.buttonText}>Sent!</Text>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={styles.blueButton}
                          onPress={() => handleAddFriend(item._id)}
                        >
                          <Text style={styles.buttonText}>Add</Text>
                        </Pressable>
                      )}
                    </View>
                  )}
                />
              )}
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
  list: {
    borderRadius: 15,
    borderTopWidth: 2,
    borderColor: "#dedede",
    width: "100%",
  },
  messageBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
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
    color: "#000",
    fontSize: 14,
    fontFamily: "Rubik",
  },
  alertText: {
    fontSize: 14,
    fontFamily: "Rubik",
  },
  spacer: {
    width: 50,
  },
  userContainer: {
    width: "50%",
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.primary,

    boxShadow: "0px 4px 0px #003f73",

    justifyContent: "center",

    alignItems: "center",
  },
  usernameText: {
    fontSize: 16,

    fontFamily: "Jua",
  },
  column: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  row: {
    alignItems: "center",
    paddingVertical: 12,
    gap: 10,
    flexDirection: "row",
    borderBottomWidth: 1,
    justifyContent: "center",
    borderBottomColor: "#dedede",
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
