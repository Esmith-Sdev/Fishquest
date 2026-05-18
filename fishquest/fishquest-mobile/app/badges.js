import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomBar from "../components/BottomNavbar";
import { BADGES } from "../data/badges.config";
import BadgeCard from "../components/BadgeCard";
import { COLORS } from "../constants/theme";
import { RADIUS } from "../constants/theme";
import Feather from "@expo/vector-icons/Feather";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
import { getToken } from "../api/auth";
export default function BadgesPage() {
  const [show, setShow] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [userBadges, setUserBadges] = useState([]);
  const selectedProgress = selectedBadge
    ? getBadgeProgress(selectedBadge.id)
    : null;

  const current = selectedProgress?.progress || 0;
  const needed = selectedProgress?.goal || 0;
  const unlocked = selectedProgress?.earned || false;

  function handleClose() {
    setSelectedBadge(null);
    setShow(false);
  }

  function handleShow(badge) {
    setSelectedBadge(badge);
    setShow(true);
  }

  function getBadgeProgress(badgeId) {
    return (
      userBadges.find((badge) => badge.badgeId === badgeId) || {
        progress: 0,
        goal: 1,
        earned: false,
      }
    );
  }
  useFocusEffect(
    useCallback(() => {
      async function fetchBadges() {
        try {
          const token = await getToken();

          const res = await fetch(
            "https://fishquest.onrender.com/api/user-stats",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const data = await res.json();

          setUserBadges(Array.isArray(data?.badges) ? data.badges : []);
        } catch {
          setUserBadges([]);
        }
      }

      fetchBadges();
    }, []),
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View style={styles.container}>
        <TopNavbarSecondary
          title="Badges"
          showButton={false}
          backRoute="/home"
        />
        <FlatList
          data={BADGES}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          removeClippedSubviews={false}
          renderItem={({ item }) => {
            const progressData = getBadgeProgress(item.id);

            return (
              <BadgeCard
                badge={item}
                unlocked={progressData.earned}
                current={progressData.progress}
                needed={progressData.goal}
                onClick={() => handleShow(item)}
              />
            );
          }}
        />
        <Modal
          visible={show}
          transparent
          animationType="fade"
          onRequestClose={handleClose}
        >
          <Pressable style={styles.modalOverlay} onPress={handleClose}>
            <Pressable
              style={styles.modalCard}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedBadge?.name}</Text>

                <Pressable onPress={handleClose} style={styles.closeButton}>
                  <Feather name="x" size={35} color="black" />
                </Pressable>
              </View>

              {selectedBadge && (
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <BadgeCard
                    badge={selectedBadge}
                    unlocked={unlocked}
                    current={current}
                    needed={needed}
                    preview={show}
                  />

                  <Text style={styles.progressText}>
                    Progress: {current}/{needed}
                  </Text>
                </View>
              )}
            </Pressable>
          </Pressable>
        </Modal>
        <BottomBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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

    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "400",
    fontFamily: "Jua",
    color: "#fff",
    left: 0,
    right: 0,
    position: "absolute",
    textAlign: "center",
  },
  backButton: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerSpacer: {
    width: 40,
  },
  grid: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 100,
  },
  row: {
    gap: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "column",
    justifyContent: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",

    textAlign: "center",
  },
  closeButton: {
    padding: 4,
    justifyContent: "flex-end",
    right: 0,
    position: "absolute",
  },
  closeText: {
    fontSize: 20,
    fontWeight: "700",
  },
  progressText: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  orangeButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
    minWidth: 80,

    shadowColor: COLORS.secondaryDropShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Jua",
    textAlign: "center",
  },
});
