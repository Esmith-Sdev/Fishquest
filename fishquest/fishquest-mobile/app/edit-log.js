import { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  Alert,
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
import { identifyFish } from "../api/identifyFish";
import Bobber from "../assets/images/Bobbers/bobber.png";
import NoBobber from "../assets/images/Bobbers/no-bobber.png";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
import { BAIT } from "../data/bait.config";
import { HOOKS } from "../data/hooks.config";
import { POLES } from "../data/poles.config";
import { WEIGHTS } from "../data/weight.config";
import LoadingIndicator from "../components/LoadingIndicator";
import { STATE_ABBREVIATIONS } from "../data/states";
import { COLORS, RADIUS } from "../constants/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import StateDropdown from "../components/StateDropdown";
import SelectDropdown from "react-native-select-dropdown";
import { MaterialCommunityIcons , FontAwesome6 } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function UpdateLog() {
  const params = useLocalSearchParams();
  const { id } = useLocalSearchParams();
  const [form, setForm] = useState({
    address: "",
    city: "",
    state: "",
  });
  const weatherOptions = [
    { id: "sunny", label: "Sunny", icon: "weather-sunny" },
    { id: "cloudy", label: "Cloudy", icon: "weather-cloudy" },
    { id: "windy", label: "Windy", icon: "weather-windy" },
    { id: "stormy", label: "Stormy", icon: "weather-lightning-rainy" },
  ];
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [files, setFiles] = useState([]);
  const [skunked, setSkunked] = useState(false);
  const [species, setSpecies] = useState(null);
  const [notes, setNotes] = useState("");
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
  const [selectedWeather, setSelectedWeather] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

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
  const [rigs, setRigs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const speciesDisabled = skunked;

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
        challenge: params.challenge ?? "",
      },
    });
  }
  async function ensureUploadedImages() {
    if (!files.length) return uploadedImageUrls;

    const newUrls = await uploadImages(files);
    const allUrls = [...uploadedImageUrls, ...newUrls];

    setUploadedImageUrls(allUrls);
    setFiles([]);

    return allUrls;
  }

  function handleRemoveImage(index, isRemote) {
    if (isRemote) {
      setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));
    } else {
      const localIndex = index - uploadedImageUrls.length;

      setFiles((prev) => prev.filter((_, i) => i !== localIndex));
    }
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
  useEffect(() => {
    async function loadLog() {
      try {
        const token = await getToken();
        if (!token) {
          router.replace("/login");
          return;
        }

        const log = await fetchLogById(id, token);
        setChallenge(log.challenge || null);
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
        setLengthUnit(log.lengthUnit || "IN");
        setSelectedDate(log.date ? new Date(log.date) : new Date());
        setSelectedWeather((log.weather || "sunny").toLowerCase());
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
      } finally {
        setLoading(false);
      }
    }

    if (id && !rigsLoading) {
      loadLog();
    }
  }, [id, rigsLoading, hydratedRigs]);

  function getPickerAssets(result) {
    const canceled = result?.canceled ?? result?.cancelled;
    if (canceled) return [];
    if (Array.isArray(result?.assets)) return result.assets;
    if (result?.uri) return [result];
    return [];
  }

  async function pickImages() {
    if (isGridFull) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Storage permission required",
        "Please allow access to your photos to upload images.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 4 - files.length,
    });

    const picked = getPickerAssets(result);
    if (!picked.length) return;

    const room = 4 - files.length;
    setFiles((prev) => [...prev, ...picked.slice(0, room)]);
  }

  async function handleSubmitLog() {
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
        address: form.address,
        weather: selectedWeather,
        city: form.city,
        state: form.state,
        challenge,
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

      await updateCatchLog(id, payload, token);
      router.replace("/logs");
    } catch (err) {
      Alert.alert("Error", err.message || "Update log failed");
    } finally {
      setLoading(false);
    }
  }

  const allImages = [
    ...uploadedImageUrls.map((url) => ({ uri: url, isRemote: true })),
    ...files.map((file) => ({ ...file, isRemote: false })),
  ];
  const isGridFull = allImages.length >= 4;
  const aiPercentage =
    typeof aiResult?.confidence === "number"
      ? Math.round(aiResult.confidence * 100)
      : null;

  function getAiPercentColor(percentage) {
    if (percentage === null) return "#666";
    if (percentage >= 75) return "#4CAF50";
    if (percentage >= 50) return "#FFC107";
    return "#F44336";
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View style={styles.screen}>
        <TopNavbarSecondary
          title="Edit Log"
          buttonText="Save"
          showButton={true}
          onButtonPress={handleSubmitLog}
          backRoute="/home"
        />
        {loading ? (
          <View style={styles.centerState}>
            <LoadingIndicator text="Loading Log" color="#fff" />
          </View>
        ) : (
          <>
            <KeyboardAwareScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.content}
              enableOnAndroid
              extraScrollHeight={200}
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
                          <Text style={styles.rigName}>
                            {selectedRig.rigName}
                          </Text>
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

              {allImages.length === 0 ? (
                <Pressable
                  style={styles.uploadImageContainer}
                  onPress={pickImages}
                >
                  <Ionicons name="camera" size={25} color="#000" />
                  <Text style={styles.uploadText}>Select Image to Upload</Text>
                  <Pressable style={styles.blueButton} onPress={pickImages}>
                    <Text style={styles.uploadText}>Select Image</Text>
                  </Pressable>
                </Pressable>
              ) : (
                <View style={styles.imageGrid}>
                  {allImages.map((img, i) => (
                    <View style={styles.imageTile} key={i}>
                      <Image
                        source={{ uri: img.uri }}
                        style={styles.gridImage}
                      />

                      <Pressable
                        style={styles.removeImageBtn}
                        onPress={() => handleRemoveImage(i, img.isRemote)}
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
                style={[
                  styles.orangeButton,
                  aiLoading && styles.disabledButton,
                ]}
                onPress={handleIdentifyFish}
                disabled={aiLoading || allImages.length === 0}
              >
                <Text style={styles.buttonText}>
                  {aiLoading ? "Identifying..." : "Identify Fish with AI"}
                </Text>
              </Pressable>
              {aiResult?.speciesName ? (
                <View style={{ marginTop: 8 }}>
                  <Text style={styles.logLabel}>
                    AI Suggestion: {aiResult.speciesName}{" "}
                    {aiPercentage !== null ? (
                      <Text style={{ color: getAiPercentColor(aiPercentage) }}>
                        ({aiPercentage}%)
                      </Text>
                    ) : null}
                  </Text>

                  {aiResult.alternatives?.length > 0 ? (
                    <Text style={styles.challengeText}>
                      Also possible:{" "}
                      {aiResult.alternatives
                        .map((a) => a.speciesName)
                        .join(", ")}
                    </Text>
                  ) : null}
                </View>
              ) : null}
              <View style={styles.logForm}>
                <View style={styles.logRow}>
                  <Text style={styles.logLabel}>Challenge:</Text>
                  <Text style={styles.challengeText}>
                    {challenge?.title ||
                      challenge?.templateKey ||
                      "No Challenge"}
                  </Text>
                </View>
                <Pressable
                  style={styles.checkboxRow}
                  onPress={() => setSkunked((prev) => !prev)}
                >
                  <Text style={styles.checkboxLabel}>
                    Skunked (No fish caught)
                  </Text>
                  <View
                    style={[
                      styles.checkboxBox,
                      skunked && styles.checkboxChecked,
                    ]}
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
                    <SelectDropdown
                      statusBarTranslucent={true}
                      data={["LB", "OZ"]}
                      defaultValue={weightUnit}
                      disabled={skunked}
                      dropdownOverlayColor="transparent"
                      onSelect={(selectedItem) => setWeightUnit(selectedItem)}
                      renderButton={(selectedItem, isOpened) => (
                        <View
                          style={[
                            styles.pillSelectSmall,
                            skunked && styles.disabledButton,
                          ]}
                        >
                          <View style={styles.logRow}>
                            <Text style={styles.selectText}>
                              {selectedItem || "LB"}
                            </Text>
                            {!isOpened ? (
                              <FontAwesome6
                                name="caret-down"
                                size={20}
                                color="black"
                              />
                            ) : (
                              <FontAwesome6
                                name="caret-up"
                                size={20}
                                color="black"
                              />
                            )}
                          </View>
                        </View>
                      )}
                      renderItem={(item, index, isSelected) => (
                        <View
                          style={[
                            styles.dropdownItem,
                            isSelected && styles.dropdownItemSelected,
                          ]}
                        >
                          <Text style={styles.selectText}>{item}</Text>
                        </View>
                      )}
                    />
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
                    <SelectDropdown
                      statusBarTranslucent={true}
                      data={["IN", "CM"]}
                      defaultValue={lengthUnit}
                      disabled={skunked}
                      dropdownOverlayColor="transparent"
                      onSelect={(selectedItem) => setLengthUnit(selectedItem)}
                      renderButton={(selectedItem, isOpened) => (
                        <View
                          style={[
                            styles.pillSelectSmall,
                            skunked && styles.disabledButton,
                          ]}
                        >
                          <View style={styles.logRow}>
                            <Text style={styles.selectText}>
                              {selectedItem || "IN"}
                            </Text>
                            {!isOpened ? (
                              <FontAwesome6
                                name="caret-down"
                                size={20}
                                color="black"
                              />
                            ) : (
                              <FontAwesome6
                                name="caret-up"
                                size={20}
                                color="black"
                              />
                            )}
                          </View>
                        </View>
                      )}
                      renderItem={(item, index, isSelected) => (
                        <View
                          style={[
                            styles.dropdownItem,
                            isSelected && styles.dropdownItemSelected,
                          ]}
                        >
                          <Text style={styles.selectText}>{item}</Text>
                        </View>
                      )}
                    />
                  </View>
                </View>

                <View style={styles.logRow}>
                  <Text style={styles.logLabel}>Date:</Text>
                  <View style={styles.fieldFlex}>
                    <Pressable
                      style={styles.pillInputMedium}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text style={styles.selectText}>
                        {selectedDate.toLocaleDateString()}
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.logRow}>
                  <Text style={styles.logLabel}>Time:</Text>
                  <View style={styles.inlineField}>
                    <Pressable
                      style={styles.pillInputMedium}
                      onPress={() => setShowTimePicker(true)}
                    >
                      <Text style={styles.selectText}>{timeValue}</Text>
                    </Pressable>
                    <Pressable
                      style={styles.pillSelectTime}
                      onPress={() =>
                        setPeriod((prev) => (prev === "AM" ? "PM" : "AM"))
                      }
                    >
                      <Text style={styles.selectText}>{period}</Text>
                    </Pressable>
                  </View>
                </View>
                <View style={styles.logRow}>
                  <Text style={styles.logLabel}>Weather:</Text>

                  <View>
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
                    placeholderTextColor="#666"
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
                      placeholderTextColor="#666"
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

                <View style={styles.notesBlock}>
                  <TextInput
                    multiline
                    numberOfLines={4}
                    style={styles.notesBox}
                    placeholder="Other Notes..."
                    placeholderTextColor="#666"
                    value={notes}
                    onChangeText={setNotes}
                  />
                </View>
              </View>

              {rigsError ? (
                <Text style={styles.rigsError}>{rigsError}</Text>
              ) : null}
            </KeyboardAwareScrollView>
          </>
        )}
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
    paddingBottom: 110,
    gap: 18,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
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
    width: 230,

    borderRadius: 50,

    paddingHorizontal: 4,
    color: "#000",
    fontFamily: "Jua",
    textAlign: "center",
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
    flex: 1,
  },
  fieldFlex: {
    minWidth: 0,
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
    height: 33,
    backgroundColor: "#dedede",
    borderRadius: 50,
    justifyContent: "center",
    paddingHorizontal: 12,
    alignItems: "center",
  },
  pillInputMedium: {
    width: 150,
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
    paddingHorizontal: 12,
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
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#dedede",
  },

  dropdownItemSelected: {
    backgroundColor: COLORS.secondary,
  },
  locationRow: {
    marginVertical: 4,
    flexDirection: "row",

    gap: 15,
    zIndex: 999,
  },
  logColumn: {
    gap: 10,
    flexDirection: "column",
    zIndex: 999,
  },
  geoError: {
    color: "red",
    marginTop: 4,
    fontFamily: "Jua",
  },

  challengeText: {
    color: COLORS.secondary,
    opacity: 1,
    fontWeight: "600",
    paddingVertical: 10,
  },
  notesBlock: {
    marginTop: 6,
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
});
