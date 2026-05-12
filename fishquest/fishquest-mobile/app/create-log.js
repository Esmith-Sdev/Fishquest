import { useState, useRef, useEffect, useMemo, use } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
  Keyboard,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavbar from "../components/BottomNavbar";
import FishSpeciesTypeahead from "../components/FishSpeciesTypeahead";
import { getCurrentLocation } from "../utils/getCurrentLocation";
import { uploadImages } from "../api/uploads";
import { createCatchLog } from "../api/logs";
import { getToken } from "../api/auth";
import { fetchRigPresets } from "../api/rigPresets";
import { identifyFish } from "../api/identifyFish";
import Bobber from "../assets/images/Bobbers/bobber.png";
import NoBobber from "../assets/images/Bobbers/no-bobber.png";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
import { BAIT } from "../data/bait.config";
import { HOOKS } from "../data/hooks.config";
import { POLES } from "../data/poles.config";
import { WEIGHTS } from "../data/weight.config";
import { STATE_ABBREVIATIONS } from "../data/states";
import { COLORS, RADIUS } from "../constants/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import StateDropdown from "../components/StateDropdown";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import SelectDropdown from "react-native-select-dropdown";
import { useAuth } from "../context/AuthContext";
import ConfettiCannon from "react-native-confetti-cannon";
import LoadingIndicator from "../components/LoadingIndicator";
export default function CreateLog() {
  const params = useLocalSearchParams();
  const [stateValue, setStateValue] = useState("");
  const [loading, setLoading] = useState(false);
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
  const [lengthUnit, setLengthUnit] = useState("IN");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [speciesDropdownOpen, setSpeciesDropdownOpen] = useState(false);
  const rigCreated = params.rigCreated === "true";
  const [timeValue, setTimeValue] = useState(() => {
    const d = new Date();
    const h24 = d.getHours();
    const mins = d.getMinutes();
    const h12 = h24 % 12 || 12;
    return `${String(h12).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  });
  const [period, setPeriod] = useState(() =>
    new Date().getHours() >= 12 ? "PM" : "AM",
  );
  const weatherOptions = [
    { id: "sunny", label: "Sunny", icon: "weather-sunny" },
    { id: "cloudy", label: "Cloudy", icon: "weather-cloudy" },
    { id: "windy", label: "Windy", icon: "weather-windy" },
    { id: "stormy", label: "Stormy", icon: "weather-lightning-rainy" },
  ];
  const [selectedWeather, setSelectedWeather] = useState();
  const [rigs, setRigs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const speciesDisabled = skunked || saving;
  const isGridFull = files.length >= 4;
  const challengeId = params.challengeId ?? "";
  const templateKey = params.templateKey ?? "";
  const challengeTitle = params.challengeTitle ?? "";
  const { refreshUserStats } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);
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

  function handleCreateRig() {
    router.push({
      pathname: "/create-rig",
      params: {
        returnTo: "/create-log",
        challengeId,
        templateKey,
        challengeTitle,
      },
    });
  }
  function dismissKeyboardBeforeDropdown() {
    Keyboard.dismiss();
  }
  async function ensureUploadedImages() {
    if (uploadedImageUrls.length) return uploadedImageUrls;

    const urls = files.length ? await uploadImages(files) : [];
    setUploadedImageUrls(urls);
    return urls;
  }

  function handleRemoveImage(indexToRemove) {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setUploadedImageUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  }
  async function handleIdentifyFish() {
    try {
      if (!files.length) {
        Alert.alert("No image", "Please upload or take a fish photo first.");
        return;
      }

      setAiLoading(true);

      const token = await getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      const urls = await ensureUploadedImages();

      const imageUrl = urls[0];

      if (!imageUrl) {
        throw new Error("Image upload failed");
      }

      const result = await identifyFish(imageUrl, form.state, token);

      console.log("AI raw result:", JSON.stringify(result, null, 2));

      setAiResult(result);

      if (!result?.isFishVisible) {
        Alert.alert(
          "No clear fish found",
          "The photo did not clearly show a fish. You can still choose the species manually.",
        );
        return;
      }

      if (result?.speciesId) {
        setSpecies({
          id: result.speciesId,
          name: result.speciesName,
          label: result.speciesName,
        });
      }
    } catch (err) {
      console.error("AI identify failed:", err);
      Alert.alert("AI Error", err.message || "Failed to identify fish");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleGetLocation() {
    setLoadingLocation(true);
    setGeoError("");

    try {
      const location = await getCurrentLocation();
      const abbr =
        typeof location.state === "string" && location.state.length === 2
          ? location.state.toUpperCase()
          : STATE_ABBREVIATIONS[location.state] || "";

      setForm((prev) => ({
        ...prev,
        address: location.streetAddress || "",
        city: location.city || "",
        state: abbr,
      }));
    } catch (err) {
      setGeoError(err.message || "Location failed");
    } finally {
      setLoadingLocation(false);
    }
  }

  async function pickImages() {
    if (isGridFull) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 4 - files.length,
    });

    if (result.canceled) return;

    const picked = result.assets || [];
    const room = 4 - files.length;
    setFiles((prev) => [...prev, ...picked.slice(0, room)]);
  }

  function getImageSource(file) {
    if (!file) return null;
    if (file.uri) return { uri: file.uri };
    return file;
  }

  async function handleSubmitLog() {
    if (saving) return;
    if (!rigPresetId) {
      Alert.alert("Missing rig", "Please select a rig preset first.");
      return;
    }

    if (!skunked && !species) {
      Alert.alert(
        "Missing species",
        "Please choose a fish species or mark the trip as skunked.",
      );
      return;
    }

    setSaving(true);

    try {
      const token = await getToken();
      if (!token) {
        router.replace("/login");
        return;
      }

      const urls = await ensureUploadedImages();

      const selectedSpecies = skunked
        ? null
        : {
            speciesId: species?.id ?? null,
            speciesName: species?.name || species?.label || "",
          };

      const payload = {
        rigPresetId,
        date: selectedDate.toISOString(),
        notes,
        imageUrls: urls,
        skunked,
        weather: selectedWeather,
        address: form.address,
        city: form.city,
        state: form.state,
        ...(challengeId
          ? {
              challenge: {
                userChallengeId: challengeId,
                templateKey,
                title: challengeTitle,
              },
            }
          : {}),
        ...(skunked
          ? {}
          : {
              ...selectedSpecies,
              weight,
              length,
              weightUnit,
              lengthUnit,
            }),
      };

      const result = await createCatchLog(payload, token);

      await refreshUserStats();

      if (result.completedChallenges?.length > 0) {
        setShowConfetti(true);
        Alert.alert(
          "Challenge Complete!",
          `You completed ${result.completedChallenges.length} challenge(s) and earned ${result.challengeXp || 0} XP!`,
          [
            {
              text: "OK",
              onPress: () => router.replace("/logs"),
            },
          ],
        );
      } else {
        router.replace("/logs");
      }
    } catch (err) {
      console.error("Create log failed:", err);
      Alert.alert("Error", err.message || "Create log failed");
    } finally {
      setSaving(false);
    }
  }

  if (rigsLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
        <View style={styles.screen}>
          <TopNavbarSecondary
            title="Create Log"
            buttonText="Save"
            showButton={true}
            onPress={handleSubmitLog}
            disabled={saving}
            loading={saving}
          />

          <LoadingIndicator text="Getting Things Setup" color="#fff" />

          <BottomNavbar />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View style={styles.screen}>
        <TopNavbarSecondary
          title="Create Log"
          buttonText="Save"
          showButton={true}
          onButtonPress={handleSubmitLog}
          backRoute="/home"
          disabled={saving}
          loading={saving}
        />
        <BottomNavbar />
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          enableOnAndroid
          extraScrollHeight={200}
          scrollEnabled={!saving}
          keyboardShouldPersistTaps="always"
          nestedScrollEnabled={true}
          keyboardDismissMode="on-drag"
        >
          <View style={styles.topArea}>
            {selectedRig ? (
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
          {files.length === 0 ? (
            <Pressable style={styles.uploadImageContainer} onPress={pickImages}>
              <Ionicons name="camera" size={25} color="#000" />
              <Text style={styles.uploadText}>Select Image to Upload</Text>
              <Pressable style={styles.blueButton} onPress={pickImages}>
                <Text style={styles.buttonText}>Select Image</Text>
              </Pressable>
            </Pressable>
          ) : (
            <View style={styles.imageGrid}>
              {files.map((file, i) => (
                <View style={styles.imageTile} key={i}>
                  <Image
                    source={getImageSource(file)}
                    style={styles.gridImage}
                  />
                  <Pressable
                    style={styles.removeImageBtn}
                    onPress={() => handleRemoveImage(i)}
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                  </Pressable>
                </View>
              ))}
              {!isGridFull && (
                <Pressable style={styles.largeSquare} onPress={pickImages}>
                  <Text style={styles.addImageText}>Add Image</Text>
                  <Ionicons
                    name="add-circle"
                    size={46}
                    color={COLORS.primary}
                  />
                </Pressable>
              )}
            </View>
          )}
          <Pressable
            style={[styles.orangeButton, aiLoading && styles.disabledButton]}
            onPress={handleIdentifyFish}
            disabled={aiLoading || files.length === 0}
          >
            <Text style={styles.buttonText}>
              {aiLoading ? "Identifying..." : "Identify Fish with AI"}
            </Text>
          </Pressable>
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
            <Pressable
              style={styles.checkboxRow}
              onPress={() => setSkunked((prev) => !prev)}
            >
              <Text style={styles.checkboxLabel}>Skunked (No fish caught)</Text>
              <View
                style={[styles.checkboxBox, skunked && styles.checkboxChecked]}
              >
                {skunked ? (
                  <Ionicons name="checkmark" size={20} color="#000" />
                ) : null}
              </View>
            </Pressable>
            <View style={styles.speciesRow}>
              <Text style={styles.logLabel}>Fish Species:</Text>
              <View style={styles.fieldFlex}>
                <View style={styles.speciesFieldWrap}>
                  <FishSpeciesTypeahead
                    disabled={speciesDisabled}
                    value={species}
                    onPick={setSpecies}
                    onOpenChange={setSpeciesDropdownOpen}
                  />
                </View>
              </View>
            </View>
            <View style={styles.logRow}>
              <Text style={styles.logLabel}>Est. Weight:</Text>
              <View style={styles.inlineField}>
                <TextInput
                  editable={!skunked}
                  style={[
                    styles.pillInputSmall,
                    skunked && styles.disabledField,
                  ]}
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={(text) =>
                    setWeight(text.replace(/\D/g, "").slice(0, 2))
                  }
                />
                <View style={styles.unitToggle}>
                  {["LB", "OZ"].map((unit) => (
                    <Pressable
                      key={unit}
                      onPress={() => {
                        Keyboard.dismiss();
                        setWeightUnit(unit);
                      }}
                      disabled={skunked}
                      style={[
                        styles.unitOption,
                        weightUnit === unit && styles.unitOptionSelected,
                        skunked && styles.disabledButton,
                      ]}
                    >
                      <Text
                        style={[
                          styles.unitText,
                          weightUnit === unit && styles.unitTextSelected,
                        ]}
                      >
                        {unit}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.logRow}>
              <Text style={styles.logLabel}>Est. Length:</Text>
              <View style={styles.inlineField}>
                <TextInput
                  editable={!skunked}
                  style={[
                    styles.pillInputSmall,
                    skunked && styles.disabledField,
                  ]}
                  keyboardType="numeric"
                  value={length}
                  onChangeText={(text) =>
                    setLength(text.replace(/\D/g, "").slice(0, 2))
                  }
                />
                <View style={styles.unitToggle}>
                  {["IN", "CM"].map((unit) => (
                    <Pressable
                      key={unit}
                      onPress={() => {
                        Keyboard.dismiss();
                        setLengthUnit(unit);
                      }}
                      disabled={skunked}
                      style={[
                        styles.unitOption,
                        lengthUnit === unit && styles.unitOptionSelected,
                        skunked && styles.disabledButton,
                      ]}
                    >
                      <Text
                        style={[
                          styles.unitText,
                          lengthUnit === unit && styles.unitTextSelected,
                        ]}
                      >
                        {unit}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.logRow}>
              <Text style={styles.logLabel}>Date:</Text>
              <View style={styles.fieldFlex}>
                <Pressable
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {selectedDate.toLocaleDateString()}
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.logRow}>
              <Text style={styles.logLabel}>Time:</Text>
              <View style={styles.inlineField}>
                <Pressable
                  style={styles.pillInputTime}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text
                    style={styles.dateButtonText}
                  >{`${timeValue} ${period}`}</Text>
                </Pressable>
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
                      <Pressable
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
                      </Pressable>
                    );
                  }}
                />
              </View>
            </View>
            <View style={styles.logColumn}>
              <Text style={styles.logLabel}>Location:</Text>
              <TextInput
                style={styles.pillInputFull}
                placeholder="Street Address"
                placeholderTextColor="#000"
                maxLength={35}
                value={form.address}
                onChangeText={(text) =>
                  setForm((p) => ({ ...p, address: text }))
                }
              />
              <View style={styles.locationRow}>
                <View style={styles.stateDropdownWrap}>
                  <StateDropdown
                    value={form.state}
                    onChange={(value) =>
                      setForm((p) => ({ ...p, state: value }))
                    }
                  />
                </View>
                <TextInput
                  style={styles.pillInputCity}
                  placeholder="City"
                  placeholderTextColor="#000"
                  maxLength={35}
                  value={form.city}
                  onChangeText={(text) =>
                    setForm((p) => ({ ...p, city: text }))
                  }
                />
              </View>
              <Pressable
                style={styles.orangeButton}
                disabled={loadingLocation}
                onPress={handleGetLocation}
              >
                <Text style={styles.buttonText}>
                  {loadingLocation
                    ? "Getting Location..."
                    : "Use Current Location"}
                </Text>
              </Pressable>
              {geoError ? (
                <Text style={styles.geoError}>{geoError}</Text>
              ) : null}
            </View>
            <View style={styles.logRow}>
              <Text style={styles.logLabel}>Challenge:</Text>
              <Text style={styles.challengeText}>
                {challengeTitle || "No Challenge"}
              </Text>
            </View>
            <TextInput
              multiline
              numberOfLines={4}
              style={styles.notesBox}
              placeholder="Other Notes..."
              placeholderTextColor="#111"
              value={notes}
              onChangeText={setNotes}
            />
          </View>
          {rigsError ? <Text style={styles.rigsError}>{rigsError}</Text> : null}
        </KeyboardAwareScrollView>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, pickedDate) => {
              setShowDatePicker(false);
              if (!event || event.type !== "set" || !pickedDate) return;
              const nextDate = new Date(selectedDate);
              nextDate.setFullYear(
                pickedDate.getFullYear(),
                pickedDate.getMonth(),
                pickedDate.getDate(),
              );
              setSelectedDate(nextDate);
              setShowTimePicker(true);
            }}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={selectedDate}
            defaul
            mode="time"
            display="default"
            onChange={(event, pickedDate) => {
              setShowTimePicker(false);
              if (!event || event.type !== "set" || !pickedDate) return;
              const nextDate = new Date(selectedDate);
              nextDate.setHours(pickedDate.getHours(), pickedDate.getMinutes());
              setSelectedDate(nextDate);
              const h24 = nextDate.getHours();
              const mins = nextDate.getMinutes();
              const h12 = h24 % 12 || 12;
              setTimeValue(
                `${String(h12).padStart(2, "0")}:${String(mins).padStart(2, "0")}`,
              );
              setPeriod(h24 >= 12 ? "PM" : "AM");
            }}
          />
        )}
        {saving && (
          <View style={styles.savingOverlay}>
            <LoadingIndicator text="Saving" color="#fff" />
          </View>
        )}
        {showConfetti && (
          <ConfettiCannon count={150} origin={{ x: -10, y: 0 }} fadeOut />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0D1B1E",
    paddingBottom: 50,
  },
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
    elevation: 99999,
  },

  savingText: {
    marginTop: 12,
    color: "#fff",
    fontFamily: "Jua",
    fontSize: 18,
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
    paddingBottom: 50,
    gap: 18,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Jua",
    marginTop: 10,
  },
  unitToggle: {
    flexDirection: "row",
    backgroundColor: "#dedede",
    borderRadius: RADIUS.pill,
    overflow: "hidden",
  },

  unitOption: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    minWidth: 42,
    alignItems: "center",
  },

  unitOptionSelected: {
    backgroundColor: COLORS.secondary,
  },

  unitText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 14,
  },
  unitTextSelected: {
    color: "#fff",
    fontFamily: "Jua",
    fontSize: 14,
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
    paddingVertical: 6,
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
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#dedede",
  },

  dropdownItemSelected: {
    backgroundColor: COLORS.secondary,
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
  dateButton: {
    backgroundColor: "#dedede",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 14,
    minWidth: 140,
  },

  dateButtonText: {
    color: "#000",
    fontFamily: "Jua",
    textAlign: "center",
  },
  speciesRow: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 9999,
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
    width: 100,
  },
  fieldFlex: {
    minWidth: 0,
    flex: 1,
  },
  inlineField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pillInputSmall: {
    width: 70,
    backgroundColor: "#dedede",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
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

  notesBox: {
    backgroundColor: "#dedede",
    paddingHorizontal: 15,
    paddingVertical: 5,
    textAlignVertical: "top",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Jua",
    borderRadius: 15,
    width: "100%",
    height: 150,
  },
  weatherOption: {
    backgroundColor: "#dedede",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  weatherOptionSelected: {
    backgroundColor: COLORS.secondary,
  },
  weatherText: {
    color: "#000",
    fontSize: 8,
    fontFamily: "Jua",
  },
  weatherTextSelected: {
    color: "#fff",
  },
  center: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
});
