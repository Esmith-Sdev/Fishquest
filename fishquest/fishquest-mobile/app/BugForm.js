import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/theme";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
import BottomNavbar from "../components/BottomNavbar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import LoadingIndicator from "../components/LoadingIndicator";
import { uploadImages } from "../api/uploads";
export default function BugForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [screen, setScreen] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

  const isGridFull = files.length >= 4;

  const [form, setForm] = useState({
    title: "",
    description: "",
    screen: "",
    imageUrl,
  });

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
    if (!title || !description || !screen) {
      alert("Please fill out all fields");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/bugs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setForm({
        title: data.title,
        description: data.description,
        imageUrl: urls,
      });
    } catch (err) {
      console.log("Failed to Submit Form", err);
    } finally {
      setSaving(false);
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <TopNavbarSecondary
        title="Buddies"
        buttonText="Add Buddy"
        showButton={true}
        onButtonPress={() => setOpenAddBuddyModal(true)}
        backRoute="/home"
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
        <View style={styles.screen}>
          <View style={styles.inputColumn}>
            <Text style={styles.label}>Subject</Text>
            <View style={styles.inputRow}>
              <TextInput
                placeholder="Subject"
                value={form.title}
                onChangeText={setTitle}
                style={styles.input}
                onChangeText={(text) => setForm((p) => ({ ...p, title: text }))}
              />
            </View>
          </View>
          <View style={styles.inputColumn}>
            <Text style={styles.label}>Description</Text>
            <View style={styles.inputRow}>
              <TextInput
                placeholder="Description"
                value={form.description}
                onChangeText={setDescription}
                style={styles.input}
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
                onChangeText={setScreen}
                style={styles.input}
                onChangeText={(text) =>
                  setForm((p) => ({ ...p, screen: text }))
                }
              />
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
        </View>
      </KeyboardAwareScrollView>
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
