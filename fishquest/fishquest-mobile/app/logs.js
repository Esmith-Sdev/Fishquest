import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavbar from "../components/BottomNavbar";
import { fetchOfflineLogs, deleteCatchLog } from "../api/offlineLogs";
import { getToken } from "../api/auth";
import skunkImage from "../assets/images/Fish/skunked.png";
import { COLORS, RADIUS } from "../constants/theme";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
import Entypo from "@expo/vector-icons/Entypo";
import LoadingIndicator from "../components/LoadingIndicator";
import ConfirmModal from "../components/ConfirmModal";
export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModeLogId, setDeleteModeLogId] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);
  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) {
          router.replace("/login");
          return;
        }

      const data = await fetchOfflineLogs(token);
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
        Alert.alert("Error", err.message || "Failed to load logs");
      } finally {
        setLoading(false);
      }
    }

    loadLogs();
  }, []);

  function getImageSource(photo) {
    return typeof photo === "string" ? { uri: photo } : photo;
  }
  async function handleRemoveLog(logId) {
    try {
      const token = await getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      await deleteCatchLog(logId, token);

      setLogs((prev) => prev.filter((log) => log._id !== logId));
      setDeleteModeLogId(null);
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to delete log");
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View style={styles.screen}>
        <TopNavbarSecondary
          title="Logs"
          buttonText="Create Log"
          showButton={true}
          buttonRoute="/create-log"
          backRoute="/home"
        />
        {loading ? (
          <View style={styles.centerState}>
            <LoadingIndicator text="Loading Logs" color="#fff" />
          </View>
        ) : (
          <>
            <View style={styles.sortRow}>
              <Text style={styles.sortLabel}>Sort By:</Text>

              <Pressable
                style={styles.orangeButtonSmall}
                onPress={() =>
                  Alert.alert(
                    "Feature Unavailable",
                    "This is not available in beta yet.",
                  )
                }
              >
                <Text style={styles.orangeButtonText}>Date</Text>
              </Pressable>

              <Pressable
                style={styles.orangeButtonSmall}
                onPress={() =>
                  Alert.alert(
                    "Feature Unavailable",
                    "This is not available in beta yet.",
                  )
                }
              >
                <Text style={styles.orangeButtonText}>Photo</Text>
              </Pressable>

              <Pressable
                style={styles.orangeButtonSmall}
                onPress={() =>
                  Alert.alert(
                    "Feature Unavailable",
                    "This is not available in beta yet.",
                  )
                }
              >
                <Text style={styles.orangeButtonText}>Location</Text>
              </Pressable>
            </View>

            <FlatList
              data={logs}
              extraData={deleteModeLogId}
              keyExtractor={(item) => item._id}
              numColumns={3}
              columnWrapperStyle={styles.gridRow}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.centerState}>
                  <Text style={styles.stateText}>No logs yet</Text>
                  <Text style={styles.subText}>
                    Create your first log to see it here.
                  </Text>
                </View>
              }
              renderItem={({ item: log }) => {
                const title = log.skunked
                  ? "Skunked Trip"
                  : log.speciesName || "Unknown Fish";

                const photo = log.skunked ? skunkImage : log.imageUrls?.[0];

                const formattedDate = log.date
                  ? new Date(log.date).toLocaleDateString()
                  : "";

                return (
                  <Pressable
                    style={styles.card}
                    onPress={() => {
                      if (deleteModeLogId === log._id) {
                        setDeleteModeLogId(null);
                        return;
                      }

                      if (log.pending) {
                        return;
                      }

                      router.push({
                        pathname: "/view-log",
                        params: { id: log._id },
                      });
                    }}
                    onLongPress={() => setDeleteModeLogId(log._id)}
                  >
                    {log.pending ? (
                      <View style={styles.pendingBadge}>
                        <Text style={styles.pendingBadgeText}>Pending</Text>
                      </View>
                    ) : null}
                    <ConfirmModal
                      title="Are you sure?"
                      visible={confirmVisible}
                      onCancel={() => {
                        setConfirmVisible(false);
                        setSelectedLogId(null);
                      }}
                      onConfirm={() => {
                        if (!selectedLogId) return;
                        handleRemoveLog(selectedLogId);
                        setConfirmVisible(false);
                        setSelectedLogId(null);
                      }}
                    />
                    {deleteModeLogId === log._id && (
                      <Pressable
                        style={styles.deleteBtn}
                        onPress={() => {
                          setSelectedLogId(log._id);
                          setConfirmVisible(true);
                        }}
                      >
                        <Ionicons name="close" size={16} color="#fff" />
                      </Pressable>
                    )}
                    <View style={styles.cardBodyTop}>
                      <Text style={styles.cardTitle} numberOfLines={2}>
                        {title}
                      </Text>
                    </View>

                    {photo ? (
                      <Image
                        source={getImageSource(photo)}
                        style={styles.cardImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.cardImage}>
                        <Entypo name="camera" size={24} color="black" />
                        <Text style={{ textAlign: "center", fontSize: 10 }}>
                          No Photo Available
                        </Text>
                      </View>
                    )}

                    <View style={styles.cardBodyBottom}>
                      <Text style={styles.cardSubtitle}>{formattedDate}</Text>
                    </View>
                  </Pressable>
                );
              }}
            />
          </>
        )}
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
  sortRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 12,
    paddingVertical: 18,
    borderBottomWidth: 2,
    borderColor: "#dedede",
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
  pendingBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(255,165,0,0.95)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 1,
  },
  pendingBadgeText: {
    color: "#000",
    fontSize: 8,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
