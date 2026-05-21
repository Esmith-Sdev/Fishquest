import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import ChallengeCard from "./ChallengeCard";
import TimedChallengeCard from "./TimedChallengeCard";
import DisabledChallengeCard from "../components/DisabledChallengeCard";
import { RADIUS } from "../constants/theme";
import { getToken } from "../api/auth";
import LoadingIndicator from "./LoadingIndicator";
const API_URL = "https://fishquest.onrender.com";

export default function DailyChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const difficultyOrder = {
    hard: 1,
    medium: 2,
    easy: 3,
  };
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
    } catch {
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  }
  const sortedChallenges = [...challenges].sort((a, b) => {
    return (
      (difficultyOrder[a.difficulty] ?? 999) -
      (difficultyOrder[b.difficulty] ?? 999)
    );
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.title}>DAILY CHALLENGES</Text>
        {loading ? (
          <View style={styles.centerState}>
            <LoadingIndicator text="Loading Challenges" color="#000" />
          </View>
        ) : (
          <>
            {sortedChallenges.map((challenge) => {
              if (challenge.isOnCooldown || challenge.isFinished) {
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
          </>
        )}
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
    minHeight: 420,
    padding: 12,
    gap: 12,
    alignItems: "center",
  },
  title: {
    color: "#000",
    fontSize: 20,
    fontWeight: "700",
    paddingBottom: 10,
    textDecorationLine: "underline",
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
});
