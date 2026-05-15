import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS } from "../constants/theme";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
import BottomNavbar from "../components/BottomNavbar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import LoadingIndicator from "../components/LoadingIndicator";
import { uploadImages } from "../api/uploads";
import { Keyboard } from "react-native";
import { getToken } from "../api/auth";
const API_URL = process.env.EXPO_PUBLIC_API_URL;
export default function BugForm() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    screen: "",
    imageUrls: [],
  });
  const [platform, setPlatform] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

  const isGridFull = files.length >= 4;

  function handleRemoveImage(indexToRemove) {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setUploadedImageUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
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
  async function ensureUploadedImages() {
    if (uploadedImageUrls.length) return uploadedImageUrls;

    const urls = files.length ? await uploadImages(files) : [];
    setUploadedImageUrls(urls);
    return urls;
  }
  async function handleSubmit() {
    if (saving) return;
    if (!form.title || !form.description || !form.screen || !platform) {
      alert("Please fill out all fields");
      return;
    }
    setSaving(true);
    try {
      const token = await getToken();

      if (!token) {
        return "No auth token found.";
      }

      const urls = await ensureUploadedImages();

      const res = await fetch(`${API_URL}/api/bugs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          screen: form.screen,
          platform,
          imageUrls: urls,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit bug report");
      }

      alert("Bug report submitted!");

      setForm({
        title: "",
        description: "",
        screen: "",
        imageUrls: [],
      });

      setFiles([]);
      setUploadedImageUrls([]);
      setPlatform("");
    } catch (err) {
      console.log("Failed to Submit Form", err);
    } finally {
      setSaving(false);
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <TopNavbarSecondary
        title="Report a Bug"
        showButton={false}
        onButtonPress={() => handleSubmit()}
        backRoute="/profile"
      />
      <View style={styles.screen}>
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
          <View style={styles.inputColumn}>
            <Text style={styles.label}>Subject</Text>
            <View style={styles.inputRow}>
              <TextInput
                placeholder="e.g. 'App crashes when I try to view my profile'"
                value={form.title}
                style={styles.input}
                onChangeText={(text) => setForm((p) => ({ ...p, title: text }))}
              />
            </View>
          </View>
          <View style={styles.inputColumn}>
            <Text style={styles.label}>Description</Text>
            <View style={styles.inputRow}>
              <TextInput
                placeholder="Write a detailed description of the bug"
                value={form.description}
                style={styles.descriptionInput}
                onChangeText={(text) =>
                  setForm((p) => ({ ...p, description: text }))
                }
              />
            </View>
          </View>
          <View style={styles.inputColumn}>
            <Text style={styles.label}>Which Screen Did This Happen On?</Text>
            <View style={styles.inputRow}>
              <TextInput
                placeholder="Home, Profile, etc."
                value={form.screen}
                style={styles.input}
                onChangeText={(text) =>
                  setForm((p) => ({ ...p, screen: text }))
                }
              />
            </View>
          </View>
          <View style={styles.inputColumn}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={styles.platformToggle}>
                {["Android", "IOS"].map((text) => (
                  <Pressable
                    key={text}
                    onPress={() => {
                      Keyboard.dismiss();
                      setPlatform(text);
                    }}
                    style={[
                      styles.platformOption,
                      platform === text && styles.platformOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.platformText,
                        platform === text && styles.platformTextSelected,
                      ]}
                    >
                      {text}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
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
        </KeyboardAwareScrollView>
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
  inputColumn: {
    flexDirection: "column",
    gap: 6,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  inputRow: {
    flexDirection: "row",
    backgroundColor: "#dedede",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  label: {
    color: "#fff",
    fontFamily: "Jua",
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
  platformToggle: {
    flexDirection: "row",
    backgroundColor: "#dedede",
    borderRadius: RADIUS.pill,
    overflow: "hidden",
  },

  platformOption: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    minWidth: 42,
    alignItems: "center",
    width: 100,
  },

  platformOptionSelected: {
    backgroundColor: COLORS.secondary,
  },

  platformText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 14,
  },
  platformTextSelected: {
    color: "#fff",
    fontFamily: "Jua",
    fontSize: 14,
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

  buttonText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 15,
    textAlign: "center",
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
});
