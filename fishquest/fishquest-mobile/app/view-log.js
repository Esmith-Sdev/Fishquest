import { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavbar from "../components/BottomNavbar";
import FishSpeciesTypeahead from "../components/FishSpeciesTypeahead";
import { getCurrentLocation } from "../utils/getCurrentLocation";
import { uploadImages } from "../api/uploads";
import { fetchLogById, updateCatchLog } from "../api/logs";
import { getToken } from "../api/auth";
import { fetchRigPresets } from "../api/rigPresets";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Bobber from "../assets/images/Bobbers/bobber.png";
import NoBobber from "../assets/images/Bobbers/no-bobber.png";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
import { BAIT } from "../data/bait.config";
import { HOOKS } from "../data/hooks.config";
import { POLES } from "../data/poles.config";
import { WEIGHTS } from "../data/weight.config";
import { STATE_ABBREVIATIONS } from "../data/states";
import { COLORS, RADIUS } from "../constants/theme";

import StateDropdown from "../components/StateDropdown";

export default function UpdateLog() {
  const params = useLocalSearchParams();
  const { id } = useLocalSearchParams();
  console.log("EDIT PAGE ID:", id);
  const [stateValue, setStateValue] = useState("");
  const [form, setForm] = useState({
    address: "",
    city: "",
    state: "",
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [files, setFiles] = useState([]);
  const [skunked, setSkunked] = useState(false);
  const [species, setSpecies] = useState(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [geoError, setGeoError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [rigsLoading, setRigsLoading] = useState(true);
  const [rigsError, setRigsError] = useState("");
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [weightUnit, setWeightUnit] = useState("LB");
  const [lengthUnit, setLengthUnit] = useState("CM");
  const [timeValue, setTimeValue] = useState();
  const [period, setPeriod] = useState("AM");
  const [rigs, setRigs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedWeather, setSelectedWeather] = useState(false);
  const speciesDisabled = skunked || saving;
  const weatherOptions = [
    { id: "sunny", label: "Sunny", icon: "weather-sunny" },
    { id: "cloudy", label: "Cloudy", icon: "weather-cloudy" },
    { id: "windy", label: "Windy", icon: "weather-windy" },
    { id: "stormy", label: "Stormy", icon: "weather-lightning-rainy" },
  ];
  useEffect(() => {
    if (skunked) setSpecies(null);
  }, [skunked]);

  useEffect(() => {
    async function loadRigs() {
      try {
        const token = await getToken();

        if (!token) {
          setRigsError("No auth token found.");
          setRigs([]);
          return;
        }

        const data = await fetchRigPresets(token);
        setRigs(Array.isArray(data) ? data : []);
        setSelectedIndex(0);
      } catch (err) {
        console.error("Rig preset load failed:", err);
        setRigsError(err.message || "Failed to load rig presets.");
        setRigs([]);
      } finally {
        setRigsLoading(false);
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
  const rigPresetId = selectedRig?._id;

  function handleCreateRig() {
    router.push({
      pathname: "/create-rig",
      params: {
        returnTo: "/create-log",
        challenge: params.challenge ?? "",
      },
    });
  }

  useEffect(() => {
    async function loadLog() {
      try {
        const token = await getToken();
        if (!token) {
          router.replace("/login");
          return;
        }

        const log = await fetchLogById(id, token);
        if (log.date) {
          const d = new Date(log.date);
          setSelectedDate(d);

          const h24 = d.getHours();
          const mins = d.getMinutes();
          const h12 = h24 % 12 || 12;

          setTimeValue(
            `${String(h12).padStart(2, "0")}:${String(mins).padStart(2, "0")}`,
          );
          setPeriod(h24 >= 12 ? "PM" : "AM");
        }
        setSkunked(log.skunked || false);
        setSpecies(
          log.skunked
            ? null
            : {
                id: log.speciesId,
                name: log.speciesName,
                label: log.speciesName,
              },
        );
        setNotes(log.notes || "");
        setWeight(log.weight ? String(log.weight) : "");
        setLength(log.length ? String(log.length) : "");
        setWeightUnit(log.weightUnit || "LB");
        setLengthUnit(log.lengthUnit || "CM");
        setSelectedDate(log.date ? new Date(log.date) : new Date());
        setSelectedWeather(log.weather || "Sunny");
        setForm({
          address: log.address || "",
          city: log.city || "",
          state: log.state || "",
        });

        setUploadedImageUrls(log.imageUrls || []);

        if (log.rigPresetId && hydratedRigs.length) {
          const foundIndex = hydratedRigs.findIndex(
            (rig) => rig._id === log.rigPresetId,
          );
          if (foundIndex !== -1) setSelectedIndex(foundIndex);
        }
      } catch (err) {
        Alert.alert("Error", err.message || "Failed to load log");
      }
    }

    if (id && !rigsLoading) {
      loadLog();
    }
  }, [id, rigsLoading, hydratedRigs]);

  function getImageSource(file) {
    if (!file) return null;
    if (file.uri) return { uri: file.uri };
    return file;
  }

  if (rigsLoading) {
    return (
      <View style={styles.screen}>
        <TopNavbarSecondary
          title="View Log"
          buttonText="Edit"
          onButtonPress={() =>
            router.push({
              pathname: "/edit-log",
              params: { id },
            })
          }
          showButton={true}
          backRoute="/logs"
        />

        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
          <Text style={styles.loadingText}>Loading rig presets...</Text>
        </View>

        <BottomNavbar />
      </View>
    );
  }
  const allImages = [
    ...uploadedImageUrls.map((url) => ({ uri: url, isRemote: true })),
    ...files.map((file) => ({ ...file, isRemote: false })),
  ];
  const isGridFull = allImages.length >= 4;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D1B1E" }}>
      <View style={styles.screen}>
        <TopNavbarSecondary
          title="View Log"
          buttonText="Edit"
          onButtonPress={() =>
            router.push({
              pathname: "/edit-log",
              params: { id },
            })
          }
          showButton={true}
          backRoute="/logs"
        />

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.topArea}>
            {selectedRig ? (
              <>
                <View style={styles.rigSection}>
                  <View style={styles.previewColumn}>
                    <View style={styles.rigTitleRow}>
                      <Text style={styles.rigName}>{selectedRig.rigName}</Text>
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
              </>
            ) : (
              <View style={styles.noRigBox}>
                <Text style={styles.noRigText}>No rig preset selected</Text>
                <Text style={styles.noRigText}>
                  No rigs found. Create one before logging.
                </Text>
                <Pressable
                  style={styles.orangeButton}
                  onPress={handleCreateRig}
                >
                  <Text style={styles.buttonText}>Create Rig</Text>
                </Pressable>
              </View>
            )}
          </View>

          {allImages.length === 0 ? (
            <View style={styles.noPhotoTile}>
              <Text style={styles.noPhotoText}>No Photo Uploaded</Text>
            </View>
          ) : (
            <View style={styles.imageGrid}>
              {allImages.map((img, i) => (
                <View style={styles.imageTile} key={i}>
                  <Image source={{ uri: img.uri }} style={styles.gridImage} />
                </View>
              ))}
            </View>
          )}

          {aiResult?.speciesName ? (
            <View style={{ marginTop: 8 }}>
              <Text style={styles.logLabel}>
                AI Suggestion: {aiResult.speciesName} (
                {Math.round(aiResult.confidence * 100)}%)
              </Text>

              {aiResult.alternatives?.length > 0 ? (
                <Text style={styles.challengeText}>
                  Also possible:{" "}
                  {aiResult.alternatives.map((a) => a.speciesName).join(", ")}
                </Text>
              ) : null}
            </View>
          ) : null}
          <View style={styles.logForm}>
            <View style={styles.checkboxRow}>
              <Text style={styles.checkboxLabel}>Skunked (No fish caught)</Text>
              <View
                style={[styles.checkboxBox, skunked && styles.checkboxChecked]}
              >
                {skunked ? (
                  <Ionicons name="checkmark" size={16} color="#000" />
                ) : null}
              </View>
            </View>

            <View style={styles.logRow}>
              <Text style={styles.logLabel}>Fish Species:</Text>
              <View style={styles.pillDisplay}>
                <Text style={styles.displayText}>
                  {skunked ? "None" : species?.label || "Unknown"}
                </Text>
              </View>
            </View>

            <View style={styles.logRow}>
              <Text style={styles.logLabel}>Est. Weight:</Text>
              <View style={styles.pillDisplay}>
                <Text style={styles.displayText}>
                  {skunked ? "N/A" : weight ? `${weight} ${weightUnit}` : "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.logRow}>
              <Text style={styles.logLabel}>Est. Length:</Text>
              <View style={styles.pillDisplay}>
                <Text style={styles.displayText}>
                  {skunked ? "N/A" : length ? `${length} ${lengthUnit}` : "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.logRow}>
              <Text style={styles.logLabel}>Date:</Text>
              <View style={styles.fieldFlex}>
                <View style={styles.pillDisplay}>
                  <Text style={styles.displayText}>
                    {selectedDate.toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.logRow}>
              <Text style={styles.logLabel}>Time:</Text>
              <View style={styles.pillDisplay}>
                <Text
                  style={styles.displayText}
                >{`${timeValue} ${period}`}</Text>
              </View>
            </View>
            <View style={styles.logRow}>
              <Text style={styles.logLabel}>Weather:</Text>
              <View style={styles.inlineField}>
                <FlatList
                  data={weatherOptions}
                  horizontal
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8 }}
                  renderItem={({ item }) => {
                    const isSelected = selectedWeather === item.id;

                    return (
                      <View
                        onPress={() => setSelectedWeather(item.id)}
                        style={[
                          styles.weatherOption,
                          isSelected && styles.weatherOptionSelected,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={item.icon}
                          size={20}
                          color={isSelected ? "#fff" : "#333"}
                        />
                        <Text
                          style={[
                            styles.weatherText,
                            isSelected && styles.weatherTextSelected,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
            <View style={styles.logColumn}>
              <Text style={styles.logLabel}>Location:</Text>

              <View style={styles.logRow}>
                <View style={styles.pillDisplayLarge}>
                  <Text style={styles.displayText}>
                    {form.address || "No address"}
                  </Text>
                </View>
                <View style={styles.locationRow}>
                  <View style={styles.pillInputSmall}>
                    <Text style={styles.displayText}>{form.state || "--"}</Text>
                  </View>
                  <View style={styles.pillDisplay}>
                    <Text style={styles.displayText}>
                      {form.city || "No city"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.logRow}>
              <Text style={styles.logLabel}>Challenge:</Text>
              <Text style={styles.challengeText}>
                {params.challenge || "Catch a fish in 10min"}
              </Text>
            </View>

            <View style={styles.notesBox}>
              <Text style={styles.displayText}>{notes || "No notes"}</Text>
            </View>
          </View>

          {rigsError ? <Text style={styles.rigsError}>{rigsError}</Text> : null}
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
    paddingHorizontal: 95,
  },
  content: {
    padding: 16,
    paddingBottom: 110,
    gap: 18,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: "#fff",
    fontFamily: "Jua",
    fontSize: 18,
  },
  orangeButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: COLORS.secondaryDropShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
  },
  blueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 4,
    paddingHorizontal: 12,
    shadowColor: COLORS.primaryDropShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  smallActionBtn: {
    minWidth: 64,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 15,
    textAlign: "center",
  },
  topArea: {
    gap: 16,
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
    fontSize: 20,
    fontWeight: "400",
    flexShrink: 1,
    fontFamily: "Jua",
    color: "#fff",
  },
  uploadImageContainer: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    backgroundColor: "#dedede",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderColor: COLORS.primary,
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

  editButton: {
    alignSelf: "flex-start",
    minWidth: 70,
  },
  noRigBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  noRigText: {
    color: "#fff",
    fontFamily: "Jua",
    fontSize: 16,
    textAlign: "center",
  },

  speciesFieldWrap: {
    flex: 1,
    zIndex: 10000,
    elevation: 40,
    minWidth: 200,
  },

  speciesRow: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 9999,
    elevation: 30,
  },
  uploadText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 12,
    marginBottom: 8,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "start",
  },
  imageTile: {
    width: 100,
    height: 100,
    borderRadius: 15,
    position: "relative",
    overflow: "hidden",
  },
  noPhotoTile: {
    width: 100,
    height: 100,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#dedede",
    padding: 5,
  },
  noPhotoText: {
    fontFamily: "Jua",
    fontSize: 12,
    textAlign: "center",
  },
  removeImageBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  largeSquare: {
    width: 100,
    height: 100,
    backgroundColor: "#dedede",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  gridImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  addImageText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 14,
    marginBottom: 4,
  },
  logForm: {
    padding: 8,
    gap: 14,
  },
  checkboxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkboxLabel: {
    color: "#fff",
    fontFamily: "Jua",
    fontSize: 16,
    flex: 1,
    marginRight: 12,
  },
  checkboxBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#dedede",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.secondary,
  },
  logRow: {
    gap: 8,
    flexDirection: "row",

    alignItems: "center",
  },

  logLabel: {
    color: "#fff",
    fontFamily: "Jua",
    fontSize: 16,
  },
  fieldFlex: {
    minWidth: 0,
  },
  inlineField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pillDisplay: {
    width: 100,
    backgroundColor: "#dedede",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pillDisplayLarge: {
    width: 125,
    backgroundColor: "#dedede",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  displayText: {
    color: "#000",
    fontFamily: "Jua",
    textAlign: "center",
  },
  pillSelectSmall: {
    width: 70,
    backgroundColor: "#dedede",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  pillInputSmall: {
    width: 60,
    backgroundColor: "#dedede",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: "#000",
    fontFamily: "Jua",
    textAlign: "center",
  },
  pillInputMedium: {
    width: 140,
    backgroundColor: "#dedede",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: "#000",
    fontFamily: "Jua",
    textAlign: "center",
  },
  pillInputTime: {
    width: 90,
    backgroundColor: "#dedede",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: "#000",
    fontFamily: "Jua",
    textAlign: "center",
  },
  pillSelectTime: {
    width: 70,
    backgroundColor: "#dedede",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  pillInputFull: {
    backgroundColor: "#dedede",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 14,
    color: "#000",
    fontFamily: "Jua",
  },
  pillInputCity: {
    width: 160,
    backgroundColor: "#dedede",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 14,
    color: "#000",
    fontFamily: "Jua",
  },
  disabledField: {
    opacity: 0.6,
  },
  selectText: {
    color: "#000",
    fontFamily: "Jua",
    textAlign: "center",
  },
  stateDropdownWrap: {
    zIndex: 9999,
    elevation: 20,
  },
  locationRow: {
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 15,
    zIndex: 999,
  },
  logColumn: {
    gap: 10,
    flexDirection: "column",
    zIndex: 999,
  },
  stateChips: {
    flexDirection: "row",
    gap: 8,
  },
  stateChip: {
    backgroundColor: "#dedede",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  stateChipActive: {
    backgroundColor: COLORS.secondary,
  },
  stateChipText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 14,
  },
  geoError: {
    color: "red",
    marginTop: 4,
    fontFamily: "Jua",
  },

  challengeText: {
    color: "#fff",
    opacity: 0.9,
    fontWeight: "600",
  },
  notesBlock: {
    marginTop: 6,
  },
  notesBox: {
    backgroundColor: "#dedede",
    padding: 5,
    fontSize: 15,
    fontFamily: "Jua",
    borderRadius: 15,
  },
});
