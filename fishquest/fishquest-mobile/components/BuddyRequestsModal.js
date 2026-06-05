import { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, RADIUS } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import LoadingIndicator from "./LoadingIndicator";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function BuddyRequestsModal({ visible, onClose }) {
  const { token } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionRequestId, setActionRequestId] = useState(null);
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    if (visible) {
      fetchRequests();
    }
  }, [visible]);

  async function fetchRequests() {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/buddies/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      setResultMessage("Could not load buddy requests.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept(requestId) {
    try {
      setActionRequestId(requestId);

      const res = await fetch(
        `${API_URL}/api/buddies/requests/${requestId}/accept`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      setRequests((prev) =>
        prev.filter((request) => request._id !== requestId),
      );
      setResultMessage(data.message || "Buddy request accepted!");
    } catch {
      setResultMessage("Could not accept request.");
    } finally {
      setActionRequestId(null);
    }
  }

  async function handleDecline(requestId) {
    try {
      setActionRequestId(requestId);

      const res = await fetch(
        `${API_URL}/api/buddies/requests/${requestId}/decline`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      setRequests((prev) =>
        prev.filter((request) => request._id !== requestId),
      );
      setResultMessage(data.message || "Buddy request declined.");
    } catch {
      setResultMessage("Could not decline request.");
    } finally {
      setActionRequestId(null);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity onPress={onClose} style={styles.overlay}>
        <TouchableOpacity
          onPress={(e) => e.stopPropagation()}
          style={styles.modalCard}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Buddy Requests</Text>

            <View style={{ position: "absolute", right: -10, top: -10 }}>
              <TouchableOpacity onPress={onClose} style={styles.button}>
                <MaterialIcons
                  name="cancel"
                  size={30}
                  color={COLORS.secondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <View style={styles.centerBox}>
              <LoadingIndicator text="Loading Requests" color="#fff" />
            </View>
          ) : resultMessage ? (
            <View style={styles.messageBox}>
              <Text style={styles.buttonText}>{resultMessage}</Text>

              <TouchableOpacity
                style={styles.orangeButton}
                onPress={() => setResultMessage("")}
              >
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              style={styles.list}
              data={requests}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={
                <View style={styles.centerBox}>
                  <Text style={styles.buttonText}>No buddy requests.</Text>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <View style={styles.userContainer}>
                    <Text style={styles.usernameText}>
                      {item.senderId?.username || "Unknown User"}
                    </Text>
                  </View>

                  {actionRequestId === item._id ? (
                    <LoadingIndicator text="" color="#fff" />
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.blueButton}
                        onPress={() => handleAccept(item._id)}
                      >
                        <FontAwesome name="check" size={20} color="black" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.orangeButton}
                        onPress={() => handleDecline(item._id)}
                      >
                        <FontAwesome6 name="xmark" size={20} color="black" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
            />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
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
  centerBox: {
    flex: 1,
    justifyContent: "center",
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
});
