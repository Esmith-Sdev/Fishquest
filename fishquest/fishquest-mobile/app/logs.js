import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavbar from "../components/BottomNavbar";
import { fetchLogs, deleteLog } from "../api/logs";
import { getToken } from "../api/auth";
import skunkImage from "../assets/images/Fish/skunked.png";
import { COLORS, RADIUS } from "../constants/theme";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
import Entypo from "@expo/vector-icons/Entypo";
import ConfirmModal from "../components/ConfirmModal";
export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

        const data = await fetchLogs(token);
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load logs:", err);
        setError(err.message || "Failed to load logs");
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

      await deleteLog(logId, token);

      setLogs((prev) => prev.filter((log) => log._id !== logId));
      setDeleteModeLogId(null);
    } catch (err) {
      console.error("Delete log failed:", err);
      setError(err.message || "Failed to delete log");
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D1B1E" }}>
      <View style={styles.screen}>
        <TopNavbarSecondary
          title="Logs"
          buttonText="Create Log"
          showButton={true}
          buttonRoute="/create-log"
          backRoute="/home"
        />
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={styles.center}
              ></ActivityIndicator>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.sortRow}>
              <Text style={styles.sortLabel}>Sort By:</Text>

              <Pressable style={styles.orangeButtonSmall}>
                <Text style={styles.orangeButtonText}>Date</Text>
              </Pressable>

              <Pressable style={styles.orangeButtonSmall}>
                <Text style={styles.orangeButtonText}>Photo</Text>
              </Pressable>

              <Pressable style={styles.orangeButtonSmall}>
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

                      router.push({
                        pathname: "/view-log",
                        params: { id: log._id },
                      });
                    }}
                    onLongPress={() => setDeleteModeLogId(log._id)}
                  >
                    <ConfirmModal
                      visible={confirmVisible}
                      onClose={() => {
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
  loadingText: {
    fontSize: 16,
    color: "#fff",
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
