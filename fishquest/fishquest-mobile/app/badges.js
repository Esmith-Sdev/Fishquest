import { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomBar from "../components/BottomNavbar";
import { BADGES } from "../data/badges.config";
import BadgeCard from "../components/BadgeCard";
import { COLORS } from "../constants/theme";
import { RADIUS } from "../constants/theme";
import Feather from "@expo/vector-icons/Feather";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
const userStats = {
  total_catches: 7,
  baitcaster_count: 12,
  bluegill_count: 3,
};

function getProgressValue(type) {
  return userStats[type] ?? 0;
}

export default function BadgesPage() {
  const [show, setShow] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  function handleClose() {
    setSelectedBadge(null);
    setShow(false);
  }

  function handleShow(badge) {
    setSelectedBadge(badge);
    setShow(true);
  }

  const current = selectedBadge
    ? getProgressValue(selectedBadge.requirement.type)
    : 0;

  const needed = selectedBadge ? selectedBadge.requirement.value : 0;
  const unlocked = selectedBadge ? current >= needed : false;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D1B1E" }}>
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
            const currentValue = getProgressValue(item.requirement.type);
            const neededValue = item.requirement.value;
            const isUnlocked = currentValue >= neededValue;
            return (
              <BadgeCard
                badge={item}
                unlocked={isUnlocked}
                current={currentValue}
                needed={neededValue}
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
