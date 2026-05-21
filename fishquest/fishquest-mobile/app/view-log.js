import { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import LoadingIndicator from "../components/LoadingIndicator";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavbar from "../components/BottomNavbar";
import { fetchLogById } from "../api/logs";
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
import { COLORS, RADIUS } from "../constants/theme";
import ImagePreviewModal from "../components/ImagePreviewModal";

export default function ViewLog() {
  const { id } = useLocalSearchParams();
  const [form, setForm] = useState({
    address: "",
    city: "",
    state: "",
  });
  const [files] = useState([]);
  const [skunked, setSkunked] = useState(false);
  const [species, setSpecies] = useState(null);
  const [notes, setNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [rigsLoading, setRigsLoading] = useState(true);
  const [rigsError, setRigsError] = useState("");
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [weightUnit, setWeightUnit] = useState("LB");
  const [lengthUnit, setLengthUnit] = useState("IN");
  const [timeValue, setTimeValue] = useState();
  const [period, setPeriod] = useState("AM");
  const [rigs, setRigs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedWeather, setSelectedWeather] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [challenge, setChallenge] = useState(null);
  const [loadingLog, setLoadingLog] = useState(true);
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
  function handleCreateRig() {
    router.push({
      pathname: "/create-rig",
      params: {
        returnTo: "/create-log",
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
        setLoadingLog(false);
      }
    }

    if (id && !rigsLoading) {
      loadLog();
    }
  }, [id, rigsLoading, hydratedRigs]);

  const allImages = [
    ...uploadedImageUrls.map((url) => ({ uri: url, isRemote: true })),
    ...files.map((file) => ({ ...file, isRemote: false })),
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
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
        <BottomNavbar />

        {loadingLog ? (
          <View style={styles.centerState}>
            <LoadingIndicator text="Loading Log" color="#fff" />
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.content}>
              <View style={styles.topArea}>
                {selectedRig ? (
                  <>
                    <View style={styles.rigSection}>
                      <View style={styles.previewColumn}>
                        <View style={styles.rigTitleRow}>
                          <Text style={styles.rigName}>
                            {selectedRig.rigName}
                          </Text>
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
                    <Pressable
                      key={i}
                      style={styles.imageTile}
                      onPress={() => {
                        setSelectedImageIndex(i);
                        setShow(true);
                      }}
                    >
                      <Image
                        source={{ uri: img.uri }}
                        style={styles.gridImage}
                      />
                    </Pressable>
                  ))}
                </View>
              )}
              <View style={styles.logForm}>
                <View style={styles.logRow}>
                  <Text style={styles.logLabel}>Challenge:</Text>
                  <Text style={styles.challengeText}>
                    {challenge?.title ||
                      challenge?.templateKey ||
                      "No Challenge"}
                  </Text>
                </View>
                <View style={styles.checkboxRow}>
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
                      {skunked
                        ? "N/A"
                        : weight
                          ? `${weight} ${weightUnit}`
                          : "N/A"}
                    </Text>
                  </View>
                </View>

                <View style={styles.logRow}>
                  <Text style={styles.logLabel}>Est. Length:</Text>
                  <View style={styles.pillDisplay}>
                    <Text style={styles.displayText}>
                      {skunked
                        ? "N/A"
                        : length
                          ? `${length} ${lengthUnit}`
                          : "N/A"}
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
                  <View style={styles.logColumn}>
                    <Text style={styles.logLabel}>Weather:</Text>

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

                  <View style={styles.logColumn}>
                    <View style={styles.logRow}>
                      <View style={styles.pillDisplayLarge}>
                        <Text style={styles.displayText}>
                          {form.address || "No address"}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.logRow}>
                      <View style={styles.pillInputSmall}>
                        <Text style={styles.displayText}>
                          {form.state || "--"}
                        </Text>
                      </View>
                      <View style={styles.pillDisplay}>
                        <Text style={styles.displayText}>
                          {form.city || "No city"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>{notes || "No notes"}</Text>
                </View>
              </View>

              {rigsError ? (
                <Text style={styles.rigsError}>{rigsError}</Text>
              ) : null}
            </ScrollView>
          </>
        )}
        <ImagePreviewModal
          show={show}
          onHide={() => setShow(false)}
          images={allImages.map((img) => ({ uri: img.uri }))}
          imageIndex={selectedImageIndex}
        />
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
    boxShadow: "0px 4px 0px #733800",

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
  buttonText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 15,
    textAlign: "center",
  },
  topArea: {
    gap: 16,
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
  gridImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
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
  pillDisplay: {
    width: 150,
    backgroundColor: "#dedede",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pillDisplayLarge: {
    width: 220,
    textWrap: "nowrap",
    backgroundColor: "#dedede",
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  displayText: {
    color: "#000",
    fontFamily: "Jua",
    textAlign: "center",
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
  logColumn: {
    gap: 10,
    flexDirection: "column",
    zIndex: 999,
  },

  challengeText: {
    color: COLORS.secondary,
    opacity: 1,
    fontWeight: "600",
    paddingVertical: 10,
  },
  notesBox: {
    backgroundColor: "#dedede",

    borderRadius: 15,
    width: "100%",
    height: 150,
  },
  notesText: {
    textAlignVertical: "top",
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Jua",
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
