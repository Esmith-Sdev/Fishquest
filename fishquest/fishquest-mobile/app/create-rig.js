import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import LoadingIndicator from "../components/LoadingIndicator";
import BottomNavbar from "../components/BottomNavbar";
import { BAIT } from "../data/bait.config";
import { POLES } from "../data/poles.config";
import { WEIGHTS } from "../data/weight.config";
import { HOOKS } from "../data/hooks.config";
import Bobber from "../assets/images/Bobbers/bobber.png";
import NoBobber from "../assets/images/Bobbers/no-bobber.png";
import { createRigPreset } from "../api/rigPresets";
import { getToken } from "../api/auth";
import { COLORS, RADIUS } from "../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavbarSecondary from "../components/TopNavbarSecondary";

export default function CreateRig() {
  const [poleId, setPoleId] = useState(POLES[0].id);
  const [baitId, setBaitId] = useState(BAIT[0].id);
  const [hookId, setHookId] = useState(HOOKS[0].id);
  const [weightId, setWeightId] = useState(WEIGHTS[0].id);
  const [rigName, setRigName] = useState("");
  const [bobber, setBobber] = useState(false);

  const [polesIndex, setPolesIndex] = useState(0);
  const [baitIndex, setBaitIndex] = useState(0);
  const [weightIndex, setWeightIndex] = useState(0);
  const [hookIndex, setHookIndex] = useState(0);
  const [poleImageLoading, setPoleImageLoading] = useState(false);
  const [baitImageLoading, setBaitImageLoading] = useState(false);
  const [hookImageLoading, setHookImageLoading] = useState(false);
  const [weightImageLoading, setWeightImageLoading] = useState(false);
  const currentPole = POLES[polesIndex];
  const currentBait = BAIT[baitIndex];
  const currentWeight = WEIGHTS[weightIndex];
  const currentHook = HOOKS[hookIndex];
  const {
    returnTo = "/home",
    challengeId = "",
    templateKey = "",
    challengeTitle = "",
  } = useLocalSearchParams();
  const nextPole = () => setPolesIndex((prev) => (prev + 1) % POLES.length);
  const prevPole = () =>
    setPolesIndex((prev) => (prev - 1 + POLES.length) % POLES.length);

  const nextBait = () => setBaitIndex((prev) => (prev + 1) % BAIT.length);
  const prevBait = () =>
    setBaitIndex((prev) => (prev - 1 + BAIT.length) % BAIT.length);

  const nextWeight = () =>
    setWeightIndex((prev) => (prev + 1) % WEIGHTS.length);
  const prevWeight = () =>
    setWeightIndex((prev) => (prev - 1 + WEIGHTS.length) % WEIGHTS.length);

  const nextHook = () => setHookIndex((prev) => (prev + 1) % HOOKS.length);
  const prevHook = () =>
    setHookIndex((prev) => (prev - 1 + HOOKS.length) % HOOKS.length);

  const toggleBobber = () => setBobber((prev) => !prev);

  useEffect(() => {
    setPoleId(currentPole.id);
  }, [currentPole]);

  useEffect(() => {
    setBaitId(currentBait.id);
  }, [currentBait]);

  useEffect(() => {
    setHookId(currentHook.id);
  }, [currentHook]);

  useEffect(() => {
    setWeightId(currentWeight.id);
  }, [currentWeight]);

  async function handleSubmitRig() {
    try {
      const token = await getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      if (!rigName.trim()) {
        Alert.alert("Missing name", "Preset name is required.");
        return;
      }

      const rig = {
        rigName,
        baitId,
        poleId,
        hookId,
        weightId,
        bobber,
      };

      await createRigPreset(rig, token);

      router.replace({
        pathname: returnTo,
        params: {
          challengeId,
          templateKey,
          challengeTitle,
          rigCreated: "true",
        },
      });
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to save rig.");
    }
  }

  const renderArrow = (onPress, direction = "left") => (
    <Pressable onPress={onPress} style={styles.arrowButton}>
      <Entypo
        name={direction === "left" ? "arrow-left" : "arrow-right"}
        size={20}
        color="#fff"
      />
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View style={styles.screen}>
        <TopNavbarSecondary
          title="Create Rig"
          buttonText="Save"
          showButton={true}
          onButtonPress={handleSubmitRig}
          backRoute="/home"
        />

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.topSection}>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="Preset Name"
                placeholderTextColor="#666"
                value={rigName}
                onChangeText={setRigName}
              />
            </View>

            <View style={styles.poleRow}>
              {renderArrow(prevPole, "left")}
              <View style={styles.optioncolumn}>
                <View style={styles.rigImageContainer}>
                  {poleImageLoading && (
                    <View style={styles.loaderOverlay}>
                      <LoadingIndicator size="small" color={COLORS.primary} />
                    </View>
                  )}
                  <Image
                    source={currentPole.image}
                    style={styles.rigImage}
                    resizeMode="contain"
                    onLoadStart={() => setPoleImageLoading(true)}
                    onLoadEnd={() => setPoleImageLoading(false)}
                  />
                </View>
                <Text style={styles.itemLabel}>{currentPole.name}</Text>
              </View>
              {renderArrow(nextPole, "right")}
            </View>

            <Pressable
              style={styles.orangeButton}
              onPress={() =>
                Alert.alert(
                  "Feature Unavailable",
                  "This is not available in beta yet.",
                )
              }
            >
              <Text style={styles.buttonText}>Customize</Text>
            </Pressable>
          </View>

          <View style={styles.optionsSection}>
            <View style={styles.column}>
              <View style={styles.optionRow}>
                {renderArrow(toggleBobber, "left")}
                <View style={styles.optioncolumn}>
                  <View style={styles.mediumSquare}>
                    <Image
                      source={bobber ? Bobber : NoBobber}
                      style={styles.optionImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.itemLabel}>
                    {bobber ? "Bobber" : "No Bobber"}
                  </Text>
                </View>

                {renderArrow(toggleBobber, "right")}
              </View>

              <View style={styles.optionRow}>
                {renderArrow(prevHook, "left")}
                <View style={styles.optioncolumn}>
                  <View style={styles.mediumSquare}>
                    {hookImageLoading && (
                      <View style={styles.loaderOverlay}>
                        <LoadingIndicator size="small" color={COLORS.primary} />
                      </View>
                    )}
                    <Image
                      source={currentHook.image}
                      style={styles.optionImage}
                      resizeMode="contain"
                      onLoadStart={() => setHookImageLoading(true)}
                      onLoadEnd={() => setHookImageLoading(false)}
                    />
                  </View>
                  <Text style={styles.itemLabel}>{currentHook.name}</Text>
                </View>

                {renderArrow(nextHook, "right")}
              </View>
            </View>

            <View style={styles.column}>
              <View style={styles.optionRow}>
                {renderArrow(prevBait, "left")}
                <View style={styles.optioncolumn}>
                  <View style={styles.mediumSquare}>
                    {baitImageLoading && (
                      <View style={styles.loaderOverlay}>
                        <LoadingIndicator size="small" color={COLORS.primary} />
                      </View>
                    )}
                    <Image
                      source={currentBait.image}
                      style={styles.optionImage}
                      resizeMode="contain"
                      onLoadStart={() => setBaitImageLoading(true)}
                      onLoadEnd={() => setBaitImageLoading(false)}
                    />
                  </View>
                  <Text style={styles.itemLabel}>{currentBait.name}</Text>
                </View>
                {renderArrow(nextBait, "right")}
              </View>

              <View style={styles.optionRow}>
                {renderArrow(prevWeight, "left")}
                <View style={styles.optioncolumn}>
                  <View style={styles.mediumSquare}>
                    {weightImageLoading && (
                      <View style={styles.loaderOverlay}>
                        <LoadingIndicator size="small" color={COLORS.primary} />
                      </View>
                    )}
                    <Image
                      source={currentWeight.image}
                      style={styles.optionImage}
                      resizeMode="contain"
                      onLoadStart={() => setWeightImageLoading(true)}
                      onLoadEnd={() => setWeightImageLoading(false)}
                    />
                  </View>
                  <Text style={styles.itemLabel}>{currentWeight.name}</Text>
                </View>

                {renderArrow(nextWeight, "right")}
              </View>
            </View>
          </View>

          <Pressable
            style={[styles.orangeButton, styles.bottomCustomize]}
            onPress={() =>
              Alert.alert(
                "Feature Unavailable",
                "This is not available in beta yet.",
              )
            }
          >
            <Text style={styles.buttonText}>Customize</Text>
          </Pressable>
        </ScrollView>

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
  },
  content: {
    padding: 16,
    paddingBottom: 110,
    alignItems: "center",
  },
  topSection: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  inputWrap: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "50%",
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 12,
    textAlign: "left",

    fontFamily: "Jua",
    fontSize: 16,
    color: "#000",
  },
  poleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    width: "100%",
  },
  rigImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    position: "relative",
  },

  mediumSquare: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    position: "relative",
  },
  rigImage: {
    width: "100%",
    height: 80,
  },
  arrowButton: {
    padding: 4,
    marginBottom: 8,
  },
  optionsSection: {
    flexDirection: "row",
    gap: 20,
    marginTop: 28,
    alignItems: "flex-start",
  },
  optioncolumn: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  column: {
    gap: 24,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  loaderOverlay: {
    position: "absolute",
    zIndex: 2,
  },
  optionImage: {
    width: 60,
    height: 60,
  },
  itemLabel: {
    marginTop: 8,
    textAlign: "center",
    color: "#fff",
    fontFamily: "Jua",
    fontSize: 11,
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
  bottomCustomize: {
    marginTop: 28,
  },
});
