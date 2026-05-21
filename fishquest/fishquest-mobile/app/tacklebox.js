import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import BottomNavbar from "../components/BottomNavbar";
import { fetchRigPresets } from "../api/rigPresets";
import { fetchRigStats } from "../api/rigStats";
import { getToken } from "../api/auth";
import Bobber from "../assets/images/Bobbers/bobber.png";
import NoBobber from "../assets/images/Bobbers/no-bobber.png";
import { COLORS , RADIUS } from "../constants/theme";

import { BAIT } from "../data/bait.config";
import { HOOKS } from "../data/hooks.config";
import { POLES } from "../data/poles.config";
import { WEIGHTS } from "../data/weight.config";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
import LoadingIndicator from "../components/LoadingIndicator";
export default function Tacklebox() {
  const [rigs, setRigs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rigStats, setRigStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const successRate =
    rigStats?.timesUsed > 0
      ? Math.min((rigStats.fishCaught / rigStats.timesUsed) * 100, 100)
      : 0;

  const trophyRate =
    rigStats?.fishCaught > 0
      ? Math.min((rigStats.bigFishCaught / rigStats.fishCaught) * 100, 100)
      : 0;

  const versatility = Math.min(((rigStats?.speciesCaught ?? 0) / 5) * 100, 100);

  useEffect(() => {
    async function loadRigs() {
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) return;

        const data = await fetchRigPresets(token);
        setRigs(Array.isArray(data) ? data : []);
        setSelectedIndex(0);
      } catch {
        setRigs([]);
      } finally {
        setLoading(false);
      }
    }

    loadRigs();
  }, []);

  const hydratedRigs = useMemo(() => {
    return rigs.map((p) => ({
      ...p,
      hook: HOOKS.find((x) => x.id === p.hookId),
      bait: BAIT.find((x) => x.id === p.baitId),
      pole: POLES.find((x) => x.id === p.poleId),
      weight: WEIGHTS.find((x) => x.id === p.weightId),
    }));
  }, [rigs]);

  const selectedRig = hydratedRigs[selectedIndex];

  useEffect(() => {
    async function loadRigStats() {
      try {
        const token = await getToken();

        if (!token || !selectedRig?._id) {
          setRigStats(null);
          return;
        }

        const data = await fetchRigStats(selectedRig._id, token);
        setRigStats(data);
      } catch {
        setRigStats(null);
      }
    }

    loadRigStats();
  }, [selectedRig]);

  const prevRig = () => {
    if (!hydratedRigs.length) return;
    setSelectedIndex(
      (i) => (i - 1 + hydratedRigs.length) % hydratedRigs.length,
    );
  };

  const nextRig = () => {
    if (!hydratedRigs.length) return;
    setSelectedIndex((i) => (i + 1) % hydratedRigs.length);
  };

  const ProgressBar = ({ value }) => (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${value}%` }]} />
    </View>
  );

  const StatRow = ({ label, value }) => (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View style={styles.screen}>
        <TopNavbarSecondary
          title="Tacklebox"
          buttonText="Create Rig"
          showButton={true}
          buttonRoute="/create-rig"
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
              <LoadingIndicator text="Loading Rigs" color="#fff" />
            </View>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            {!selectedRig ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No rigs yet.</Text>
                <Pressable
                  style={styles.orangeButton}
                  onPress={() => router.push("/create-rig")}
                >
                  <Text style={styles.buttonText}>Create your first rig</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <View style={styles.rigSection}>
                  <View style={styles.previewColumn}>
                    <View style={styles.rigTitleRow}>
                      <Pressable onPress={prevRig}>
                        <Text style={styles.caret}>◀</Text>
                      </Pressable>
                      <Text style={styles.rigName}>{selectedRig.rigName}</Text>
                      <Pressable onPress={nextRig}>
                        <Text style={styles.caret}>▶</Text>
                      </Pressable>
                    </View>
                    <View style={styles.rigImageContainer}>
                      {selectedRig.pole?.image ? (
                        <Image
                          source={selectedRig.pole.image}
                          style={styles.rigImage}
                          resizeMode="contain"
                        />
                      ) : null}
                    </View>
                  </View>
                  <View style={styles.optionsGrid}>
                    <View style={styles.optionColumn}>
                      <View style={styles.smallSquare}>
                        <Image
                          source={selectedRig.bobber ? Bobber : NoBobber}
                          style={styles.optionImage}
                          resizeMode="contain"
                        />
                      </View>
                      <View style={styles.smallSquare}>
                        {selectedRig.bait?.image ? (
                          <Image
                            source={selectedRig.bait.image}
                            style={styles.optionImage}
                            resizeMode="contain"
                          />
                        ) : null}
                      </View>
                    </View>
                    <View style={styles.optionColumn}>
                      <View style={styles.smallSquare}>
                        {selectedRig.hook?.image ? (
                          <Image
                            source={selectedRig.hook.image}
                            style={styles.optionImage}
                            resizeMode="contain"
                          />
                        ) : null}
                      </View>
                      <View style={styles.smallSquare}>
                        {selectedRig.weight?.image ? (
                          <Image
                            source={selectedRig.weight.image}
                            style={styles.optionImage}
                            resizeMode="contain"
                          />
                        ) : null}
                      </View>
                    </View>
                  </View>
                </View>
                <Text style={styles.sectionTitle}>Rig Stats</Text>
                <View style={styles.statsContainer}>
                  <StatRow
                    label="Fish Caught:"
                    value={rigStats?.fishCaught ?? 0}
                  />
                  <StatRow
                    label="Times Skunked:"
                    value={rigStats?.skunked ?? 0}
                  />
                  <StatRow
                    label="Challenges Completed:"
                    value={rigStats?.challengesCompleted ?? 0}
                  />
                  <StatRow
                    label="Avg. Fish Weight:"
                    value={
                      rigStats?.avgWeight
                        ? `${rigStats.avgWeight.toFixed(2)} LB`
                        : "0 LB"
                    }
                  />
                  <StatRow
                    label="Avg. Fish Length:"
                    value={
                      rigStats?.avgLength
                        ? `${rigStats.avgLength.toFixed(2)} IN`
                        : "0 IN"
                    }
                  />
                  <StatRow
                    label="Morning Catches:"
                    value={rigStats?.fishCaughtMorning ?? 0}
                  />
                  <StatRow
                    label="Day Catches:"
                    value={rigStats?.fishCaughtDay ?? 0}
                  />
                  <StatRow
                    label="Night Catches:"
                    value={rigStats?.fishCaughtNight ?? 0}
                  />
                  <View style={styles.progressBlock}>
                    <Text style={styles.progressLabel}>Versatility</Text>
                    <ProgressBar value={versatility} />
                  </View>
                  <View style={styles.progressBlock}>
                    <Text style={styles.progressLabel}>Success Rate</Text>
                    <ProgressBar value={successRate} />
                  </View>
                  <View style={styles.progressBlock}>
                    <Text style={styles.progressLabel}>Trophy Potential</Text>
                    <ProgressBar value={trophyRate} />
                  </View>
                </View>
              </>
            )}
          </ScrollView>
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
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  caret: {
    color: "#fff",
    fontSize: 20,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 14,
  },
  emptyText: {
    fontSize: 18,
    color: "#fff",
  },
  rigSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    gap: 20,
  },
  previewColumn: {
    width: "42%",
  },
  rigTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
    justifyContent: "center",
  },

  rigName: {
    fontSize: 16,
    fontWeight: "400",
    flexShrink: 1,
    fontFamily: "Jua",
    color: "#fff",
    textAlign: "center",
  },
  rigImageContainer: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 10,
  },
  rigImage: {
    width: "100%",
    height: "100%",
  },
  optionsGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
  },
  optionColumn: {
    gap: 12,
  },
  smallSquare: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#dedede",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  optionImage: {
    width: "90%",
    height: "90%",
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
  sectionTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "400",
    marginTop: 28,
    marginBottom: 16,
    fontFamily: "Jua",
    color: "#fff",
  },
  statsContainer: {
    gap: 14,
    paddingBottom: 24,
    paddingHorizontal: 10,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  statLabel: {
    fontSize: 17,
    fontWeight: "400",
    flex: 1,
    fontFamily: "Jua",
    color: "#fff",
  },
  statValue: {
    fontSize: 17,
    fontWeight: "400",
    fontFamily: "Jua",
    color: "#fff",
  },
  progressBlock: {
    marginTop: 8,
    gap: 6,
  },
  progressLabel: {
    fontSize: 17,
    fontWeight: "400",
    fontFamily: "Jua",
    color: "#fff",
  },
  progressTrack: {
    width: "100%",
    height: 12,
    backgroundColor: "#e2e2e2",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#f28c28",
    borderRadius: 999,
  },
});
