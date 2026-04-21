import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import ChallengeCard from "./ChallengeCard";
import TimedChallengeCard from "./TimedChallengeCard";
import DisabledChallengeCard from "../components/DisabledChallengeCard";
import { COLORS, RADIUS } from "../constants/theme";
import { filterByDaily, limitChallenges } from "../utils/getFilteredCategories";
import { useAuth } from "../context/AuthContext";
const API_URL = "https://fishquest.onrender.com";

export default function DailyChallenges() {
  const [challenges, setChallenges] = useState([]);

  const { user } = useAuth();
  const userId = user?.id;

  const dailyChallenges = limitChallenges(filterByDaily(challenges), 3);

  useEffect(() => {
    if (!userId) return;

    fetch(`${API_URL}/api/challenges/${userId}`)
      .then((res) => res.json())
      .then((data) => setChallenges(data))
      .catch((err) => console.log("fetch error:", err));
  }, [userId]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.title}>DAILY CHALLENGES</Text>

        {dailyChallenges.map((challenge) => {
          const isDisabled = challenge.isOnCooldown;

          if (isDisabled) {
            return (
              <DisabledChallengeCard key={challenge.id} challenge={challenge} />
            );
          }

          if (challenge.type === "timed") {
            return (
              <TimedChallengeCard key={challenge.id} challenge={challenge} />
            );
          }

          return <ChallengeCard key={challenge.id} challenge={challenge} />;
        })}

        <View style={styles.shadowWrapper}>
          <Pressable
            style={styles.button}
            onPress={() => router.push("/challenges")}
          >
            <Text style={styles.buttonText}>All Challenges</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    width: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.md,
    padding: 12,
    gap: 12,
    alignItems: "center",
  },
  title: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  shadowWrapper: {
    marginTop: 2,
    alignSelf: "center",
  },
  button: {
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
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Jua",
    textAlign: "center",
  },
});
