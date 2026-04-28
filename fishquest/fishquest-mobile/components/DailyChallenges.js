import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import ChallengeCard from "./ChallengeCard";
import TimedChallengeCard from "./TimedChallengeCard";
import DisabledChallengeCard from "../components/DisabledChallengeCard";
import { COLORS, RADIUS } from "../constants/theme";
import { getToken } from "../api/auth";

const API_URL = "https://fishquest.onrender.com";

export default function DailyChallenges() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    fetchChallenges();
  }, []);

  async function fetchChallenges() {
    try {
      const token = await getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/challenges`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch challenges");
      }

      setChallenges(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("fetch error:", err);
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.title}>DAILY CHALLENGES</Text>

        {challenges.map((challenge) => {
          if (challenge.isOnCooldown) {
            return (
              <DisabledChallengeCard
                key={challenge.userChallengeId}
                challenge={challenge}
              />
            );
          }

          if (challenge.type === "timed") {
            return (
              <TimedChallengeCard
                key={challenge.userChallengeId}
                challenge={challenge}
                onRefresh={fetchChallenges}
              />
            );
          }

          return (
            <ChallengeCard
              key={challenge.userChallengeId}
              challenge={challenge}
            />
          );
        })}
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
    paddingBottom: 10,
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
