import { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TimedChallengeCard from "../components/TimedChallengeCard";
import ChallengeCard from "../components/ChallengeCard";
import BottomNavbar from "../components/BottomNavbar";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { COLORS, RADIUS } from "../constants/theme";
import {
  filterBySpecies,
  filterByTimed,
  filterByLuck,
  filterByRig,
  filterByAdventure,
  limitChallenges,
} from "../utils/filterChallengeCategories";

const API_URL = "https://fishquest.onrender.com";

export default function ChallengePage() {
  const [challenges, setChallenges] = useState([]);

  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(3);
  const { user } = useAuth();
  const userId = user?.id;
  useEffect(() => {
    async function loadUserId() {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (!storedUserId) {
        console.log("No userId found");
        return;
      }
      setUserId(storedUserId);
    }

    loadUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetch(`${API_URL}/api/challenges/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("userId:", userId);
        console.log("challenge data:", data);
        setChallenges(data);
      })
      .catch((error) => console.error("fetch error:", error));
  }, [userId]);

  function getFilteredChallenges() {
    const baseChallenges = challenges;

    switch (activeFilter) {
      case "fish":
        return filterBySpecies(baseChallenges);
      case "rig":
        return filterByRig(baseChallenges);
      case "luck":
        return filterByLuck(baseChallenges);
      case "timed":
        return filterByTimed(baseChallenges);
      case "adventure":
        return filterByAdventure(baseChallenges);
      default:
        return baseChallenges;
    }
  }

  const filteredChallenges = getFilteredChallenges();
  const slicedChallenges = limitChallenges(filteredChallenges, visibleCount);

  useEffect(() => {
    setVisibleCount(3);
  }, [activeFilter]);

  const filters = ["all", "fish", "luck", "rig", "timed", "adventure"];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <TopNavbarSecondary
          title="Challenges"
          showButton={false}
          backRoute="/home"
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Filter:</Text>

            {filters.map((filter) => (
              <Pressable
                key={filter}
                style={[
                  styles.filterButton,
                  activeFilter === filter && styles.activeFilterButton,
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={styles.filterButtonText}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.challengeBox}>
            <Text style={styles.challengeHeading}>{activeFilter}</Text>

            {slicedChallenges.map((challenge) =>
              challenge.type === "timed" ? (
                <TimedChallengeCard key={challenge.id} challenge={challenge} />
              ) : (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ),
            )}

            {visibleCount < filteredChallenges.length && (
              <Pressable
                style={styles.showMoreButton}
                onPress={() => setVisibleCount(filteredChallenges.length)}
              >
                <Text style={styles.showMoreText}>Show More</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>

        <BottomNavbar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D1B1E",
  },
  screen: {
    flex: 1,
    backgroundColor: "#0D1B1E",
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
    alignItems: "center",
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backIcon: {
    fontSize: 28,
    color: "white",
    fontWeight: "700",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  headerSpacer: {
    width: 28,
  },
  filterRow: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  filterLabel: {
    color: "white",
    fontSize: 12,

    marginRight: 4,
    fontFamily: "Jua",
  },
  filterButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
    minWidth: 40,

    shadowColor: COLORS.secondaryDropShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
  },
  filterButtonText: {
    color: "#000",
    fontSize: 8,
    fontFamily: "Jua",
    textAlign: "center",
  },
  challengeBox: {
    width: "100%",
    maxWidth: 800,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 12,
    gap: 12,
    alignItems: "center",
  },
  challengeHeading: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "capitalize",
    textDecorationLine: "underline",
  },
  showMoreButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 4,
    paddingHorizontal: 18,
    minWidth: 80,
    marginTop: 2,
    shadowColor: COLORS.secondaryDropShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
  },
  showMoreText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Jua",
    textAlign: "center",
  },
});
