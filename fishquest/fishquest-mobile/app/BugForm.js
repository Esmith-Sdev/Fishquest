import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/theme";
import TopNavbarSecondary from "../components/TopNavbarSecondary";
import BottomNavbar from "../components/BottomNavbar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import LoadingIndicator from "../components/LoadingIndicator";

export default function BugForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [screen, setScreen] = useState("");

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
  async function handleSubmit() {
    if (saving) return;
    if (!title || !description || !screen) {
      alert("Please fill out all fields");
      return;
    }
    setSaving(true);
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
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
            </View>
          </View>
          <View style={styles.inputColumn}>
            <Text style={styles.label}>Description</Text>
            <View style={styles.inputRow}>
              <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
              />
            </View>
          </View>
          <View style={styles.inputColumn}>
            <Text style={styles.label}>Which Screen Did This Happen On?</Text>
            <View style={styles.inputRow}>
              <TextInput
                placeholder="Home, Profile, etc."
                value={screen}
                onChangeText={setScreen}
                style={styles.input}
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
  },
});
