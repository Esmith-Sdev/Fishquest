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
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
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

import { BAIT } from "../data/bait.config";
import { HOOKS } from "../data/hooks.config";
import { POLES } from "../data/poles.config";
import { WEIGHTS } from "../data/weight.config";
import { STATE_ABBREVIATIONS } from "../data/states";
import { COLORS, RADIUS } from "../constants/theme";

import StateDropdown from "../components/StateDropdown";

export default function CreateLog() {
  const params = useLocalSearchParams();
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

  const speciesDisabled = skunked || saving;
  const isGridFull = files.length >= 4;

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
        challenge: params.challenge ?? "",
      },
    });
  }
  async function ensureUploadedImages() {
    if (uploadedImageUrls.length) return uploadedImageUrls;

    const urls = files.length ? await uploadImages(files) : [];
    setUploadedImageUrls(urls);
    return urls;
  }
  async function handleIdentifyFish() {
    try {
      console.log("1. handleIdentifyFish started");

      if (!files.length) {
        Alert.alert("No image", "Please upload or take a fish photo first.");
        return;
      }

      setAiLoading(true);
      console.log("2. passed file check");

      const token = await getToken();
      console.log("3. token loaded?", !!token);

      if (!token) {
        router.replace("/login");
        return;
      }

      const urls = await ensureUploadedImages();
      console.log("4. uploaded urls:", urls);
      console.log("uploaded urls raw:", JSON.stringify(urls, null, 2));
      const imageUrl = urls[0];
      console.log("5. first imageUrl:", imageUrl);

      if (!imageUrl) {
        throw new Error("Image upload failed");
      }

      console.log("6. about to call identifyFish");

      const result = await identifyFish(imageUrl, form.state, token);

      console.log("7. identifyFish returned");
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
      console.log("8. finally block reached");
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
        address: form.address,
        city: form.city,
        state: form.state,
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

      await createCatchLog(payload, token);
      router.replace("/logs");
    } catch (err) {
      console.error("Create log failed:", err);
      Alert.alert("Error", err.message || "Create log failed");
    } finally {
      setSaving(false);
    }
  }

  if (rigsLoading) {
    return (
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back-circle" size={30} color="#fff" />
          </Pressable>

          <Text style={styles.headerTitle}>Create Log</Text>

          <Pressable
            style={[styles.orangeButton, styles.disabledButton]}
            disabled
          >
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </View>

        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
          <Text style={styles.loadingText}>Loading rig presets...</Text>
        </View>

        <BottomNavbar />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D1B1E" }}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back-circle" size={30} color="#fff" />
          </Pressable>

          <Text style={styles.headerTitle}>Create Log</Text>

          <Pressable style={styles.orangeButton} onPress={handleSubmitLog}>
            <Text style={styles.buttonText}>
              {saving ? "Saving..." : "Submit"}
            </Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.topArea}>
            {selectedRig ? (
              <>
                <View style={styles.rigBlock}>
                  <View style={styles.rigTitleRow}>
                    <Pressable onPress={prevRig}>
                      <Ionicons name="caret-back" size={24} color="#fff" />
                    </Pressable>

                    <Text style={styles.rigTitle}>{selectedRig.rigName}</Text>

                    <Pressable onPress={nextRig}>
                      <Ionicons name="caret-forward" size={24} color="#fff" />
                    </Pressable>
                  </View>

                  <View style={styles.rigPreviewRow}>
                    <View style={styles.leftRigCol}>
                      <View style={styles.rigImageContainer}>
                        {selectedRig?.pole?.image ? (
                          <Image
                            source={
                              selectedRig.pole.image?.uri
                                ? { uri: selectedRig.pole.image.uri }
                                : selectedRig.pole.image
                            }
                            style={styles.rigMainImage}
                            resizeMode="contain"
                          />
                        ) : null}
                      </View>

                      <Pressable
                        style={[styles.orangeButton, styles.smallActionBtn]}
                        onPress={() =>
                          router.push(`/edit-rig/${selectedRig._id}`)
                        }
                      >
                        <Text style={styles.buttonText}>Edit</Text>
                      </Pressable>
                    </View>

                    <View style={styles.optionsCols}>
                      <View style={styles.optionCol}>
                        <View style={styles.smallSquare}>
                          <Image
                            source={selectedRig.bobber ? Bobber : NoBobber}
                            style={styles.smallSquareImage}
                            resizeMode="contain"
                          />
                        </View>

                        <View style={styles.smallSquare}>
                          {selectedRig?.bait?.image ? (
                            <Image
                              source={selectedRig.bait.image}
                              style={styles.smallSquareImage}
                              resizeMode="contain"
                            />
                          ) : null}
                        </View>
                      </View>

                      <View style={styles.optionCol}>
                        <View style={styles.smallSquare}>
                          {selectedRig?.hook?.image ? (
                            <Image
                              source={selectedRig.hook.image}
                              style={styles.smallSquareImage}
                              resizeMode="contain"
                            />
                          ) : null}
                        </View>

                        <View style={styles.smallSquare}>
                          {selectedRig?.weight?.image ? (
                            <Image
                              source={selectedRig.weight.image}
                              style={styles.smallSquareImage}
                              resizeMode="contain"
                            />
                          ) : null}
                        </View>
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
            <View style={styles.photoUploadContainer}>
              <Pressable
                style={styles.photoUploadIconContainer}
                onPress={pickImages}
              >
                <Text style={styles.uploadText}>Upload Image</Text>
                <Ionicons name="camera" size={54} color="#000" />
              </Pressable>
            </View>
          ) : (
            <View style={styles.imageGrid}>
              {files.map((file, i) => (
                <View style={styles.largeSquare} key={i}>
                  <Image
                    source={getImageSource(file)}
                    style={styles.gridImage}
                  />
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
                  <Ionicons name="checkmark" size={16} color="#000" />
                ) : null}
              </View>
            </Pressable>

            <View style={styles.logRow}>
              <Text style={styles.logLabel}>Fish Species:</Text>
              <View style={styles.fieldFlex}>
                <FishSpeciesTypeahead
                  disabled={speciesDisabled}
                  value={species}
                  onPick={setSpecies}
                />
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
                <Pressable
                  style={[
                    styles.pillSelectSmall,
                    skunked && styles.disabledField,
                  ]}
                  onPress={() =>
                    setWeightUnit((prev) => (prev === "LB" ? "OZ" : "LB"))
                  }
                  disabled={skunked}
                >
                  <Text style={styles.selectText}>{weightUnit}</Text>
                </Pressable>
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
                <Pressable
                  style={[
                    styles.pillSelectSmall,
                    skunked && styles.disabledField,
                  ]}
                  onPress={() =>
                    setLengthUnit((prev) => (prev === "CM" ? "IN" : "CM"))
                  }
                  disabled={skunked}
                >
                  <Text style={styles.selectText}>{lengthUnit}</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.logRow}>
              <Text style={styles.logLabel}>Date:</Text>
              <View style={styles.fieldFlex}>
                <TextInput
                  style={styles.pillInputMedium}
                  value={selectedDate.toLocaleDateString()}
                  editable={false}
                />
              </View>
            </View>

            <View style={styles.logRow}>
              <Text style={styles.logLabel}>Time:</Text>
              <View style={styles.inlineField}>
                <TextInput
                  style={styles.pillInputTime}
                  value={timeValue}
                  onChangeText={setTimeValue}
                />
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
                {params.challenge || "Catch a fish in 10min"}
              </Text>
            </View>

            <View style={styles.notesBlock}>
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
    backgroundColor: "#212529",
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
  rigBlock: {
    gap: 12,
  },
  rigTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rigTitle: {
    color: "#fff",
    fontFamily: "Jua",
    fontSize: 20,
    textDecorationLine: "underline",
  },
  rigPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  leftRigCol: {
    width: 144,
  },
  rigImageContainer: {
    backgroundColor: "#d9d9d9",
    width: 144,
    height: 144,
    borderRadius: 15,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  rigMainImage: {
    width: "100%",
    height: "100%",
  },
  optionsCols: {
    flexDirection: "row",
    gap: 12,
  },
  optionCol: {
    gap: 12,
  },
  smallSquare: {
    width: 50,
    height: 50,
    backgroundColor: "#dedede",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  smallSquareImage: {
    width: "100%",
    height: "100%",
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
  photoUploadContainer: {
    backgroundColor: "#dedede",
    borderRadius: 15,
    padding: 18,
    width: 200,
    height: "auto",
    alignItems: "center",
  },
  photoUploadIconContainer: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 15,
    padding: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 18,
    marginBottom: 8,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
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
