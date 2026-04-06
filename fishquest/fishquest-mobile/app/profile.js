import { useState } from "react";
import { View, Text, StyleSheet, Pressable, Image, Modal } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import BottomNavbar from "../components/BottomNavbar";
import { logout, getAuth } from "../api/auth";
import { COLORS, RADIUS } from "../constants/theme";

export default function Profile() {
  const username = getAuth();
  const [show, setShow] = useState(false);

  const titles = [
    "Minnow Wrangler",
    "Pond Rookie",
    "Bobber Buddy",
    "Reel Recruit",
    "Hook Apprentice",
    "Line Caster",
    "Bait Specialist",
    "Tackle Technician",
    "Lure Adept",
    "Dock Adventurer",
    "Shoreline Scout",
    "River Ranger",
    "Lake Legend",
    "Deepwater Pro",
    "Tide Tamer",
    "Master Angler",
    "Mythic Fisher",
    "King of the Catch",
    "Reelmaster Supreme",
    "Fish God",
  ];

  const rank = 1;
  const rankTitle = titles[rank - 1];
  const xp = 60;

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={30} color="#fff" />
        </Pressable>

        <Text style={styles.headerTitle}>Profile</Text>

        <Pressable style={styles.orangeButton} onPress={() => setShow(true)}>
          <Text style={styles.buttonText}>Settings</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.profileRow}>
          <View style={styles.leftColumn}>
            <Text style={styles.username}>{username || "User"}</Text>

            <View style={styles.profileImageContainer}>
              <Image />
            </View>

            <Pressable
              style={styles.orangeButton}
              onPress={() => router.push("/edit-profile")}
            >
              <Text style={styles.buttonText}>Customize</Text>
            </Pressable>
          </View>

          <View style={styles.statsColumn}>
            <Text style={styles.statsTitle}>Stats</Text>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Personal Best:</Text>
              <Text style={styles.statValue}>5.6lb</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Fish Caught:</Text>
              <Text style={styles.statValue}>5</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Challenges Completed:</Text>
              <Text style={styles.statValue}>5</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Favorite Bait:</Text>
              <Text style={styles.statValue}>Frog</Text>
            </View>
          </View>
        </View>

        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>{rankTitle}</Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${xp}%` }]} />
            <Text style={styles.progressLabel}>XP</Text>
          </View>

          <Text style={styles.levelText}>Level {rank}</Text>
        </View>
      </View>

      <BottomNavbar />

      <Modal
        visible={show}
        transparent
        animationType="fade"
        onRequestClose={() => setShow(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Settings</Text>
              <Pressable onPress={() => setShow(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </Pressable>
            </View>

            <View style={styles.modalBody} />

            <View style={styles.modalFooter}>
              <Pressable style={styles.orangeButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    borderBottomColor: "#e5e5e5",
  },
  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Jua",
    color: "#fff",
    paddingHorizontal: 90,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  },
  profileRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
  },
  leftColumn: {
    flex: 1,
    alignItems: "center",
  },
  username: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "Jua",
    marginBottom: 8,
    textAlign: "center",
  },
  profileImageContainer: {
    width: 130,
    height: 130,
    borderRadius: 16,
    backgroundColor: "#f3f3f3",
    marginBottom: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  statsColumn: {
    flex: 1.2,
    gap: 12,
  },
  statsTitle: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "Jua",
    textAlign: "center",
    marginBottom: 8,
  },
  statRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  statLabel: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Jua",
  },
  statValue: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Jua",
  },
  rankContainer: {
    marginTop: 24,
    padding: 16,
    width: "100%",
  },
  rankText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Jua",
    textAlign: "center",
    marginBottom: 8,
  },
  progressTrack: {
    width: "100%",
    height: 18,
    backgroundColor: "#d9d9d9",
    borderRadius: 999,
    overflow: "hidden",
    justifyContent: "center",
    borderColor: "#000",
    borderWidth: 1,
    position: "relative",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.secondary,
    borderRadius: 999,
  },
  progressLabel: {
    textAlign: "center",
    fontSize: 11,
    color: "#000",
    fontFamily: "Jua",
  },
  levelText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Jua",
    textAlign: "center",
    marginTop: 8,
  },
  orangeButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 90,
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
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: "Jua",
    color: "#000",
  },
  modalBody: {
    minHeight: 40,
    marginTop: 10,
  },
  modalFooter: {
    marginTop: 12,
    alignItems: "flex-end",
  },
});
