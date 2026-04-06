import { View, Text, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, RADIUS } from "../constants/theme";

import Coin from "../assets/images/icons/Coin.png";

export default function Topbar() {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = monthNames[currentDate.getMonth()];
  const day = currentDate.getDate();

  const setDate = `${month} ${day}, ${year}`;

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const setTime = formatter.format(currentDate);

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
  const setRankTitle = titles[rank - 1];
  const xp = 60;

  return (
    <View style={styles.topNavbar}>
      <View style={styles.left}>
        <View>
          <Text style={styles.smallText}>{setTime}</Text>
          <Text style={styles.smallText}>{setDate}</Text>
        </View>
      </View>

      <View style={styles.center}>
        <Text style={styles.rankText}>{setRankTitle}</Text>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${xp}%` }]} />
          <Text style={styles.progressLabel}>XP</Text>
        </View>
      </View>

      <View style={styles.right}>
        <Link href="/shop" asChild>
          <View style={styles.iconButton}>
            <Image source={Coin} style={styles.coin} resizeMode="contain" />
          </View>
        </Link>

        <View style={styles.iconButton}>
          <Ionicons name="people" size={24} color="#fff" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topNavbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: COLORS.primary,
    width: "100%",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  smallText: {
    color: "#fff",
    fontSize: 8,
  },
  rankText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 6,
    textAlign: "center",
    fontFamily: "Jua",
  },
  progressTrack: {
    width: "100%",
    height: 14,
    backgroundColor: "#d9d9d9",
    borderRadius: 999,
    overflow: "hidden",
    justifyContent: "center",
    borderColor: "#000",
    borderWidth: 1,
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
    fontSize: 10,
    color: "#000",
    fontWeight: "700",
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  coin: {
    width: 28,
    height: 28,
  },
});
