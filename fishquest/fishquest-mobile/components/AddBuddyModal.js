import { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, RADIUS } from "../constants/theme";
import { getCurrentLocation } from "../utils/getCurrentLocation";
import { ActivityIndicator } from "react-native";

export default function AddBuddyModal({ visible, onClose }) {
  const [loading, setLoading] = useState(false);
  async function sendFriendRequest(receiverId) {
    const res = await fetch(`${API_URL}/api/friends/request/${receiverId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return data;
  }

  async function searchUsers(query) {
    const res = await fetch(`${API_URL}/api/users/search?query=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return data;
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
                />
              </View>
              <Pressable style={styles.orangeButton} onPress={searchForBuddy}>
                <Text style={styles.buttonText}>Search</Text>
              </Pressable>
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
