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
import { fetchLogs } from "../api/logs";
import { getToken } from "../api/auth";
import skunkImage from "../assets/images/Fish/skunked.png";
import { COLORS, RADIUS } from "../constants/theme";
import TopNavbarSecondary from "../components/TopNavbarSecondary";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLogs() {
      try {
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
                onPress={() =>
                  router.push({
                    pathname: "/edit-log",
                    params: { id: log._id },
                  })
                }
              >
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
                    <Text style={{ textAlign: "center" }}>
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
    color: "#555",
    textAlign: "center",
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: 15,
    marginVertical: 4,
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
