import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import GradientBackground from "../components/GradientBackground";
import { COLORS, RADIUS } from "../constants/theme";
import LeftArrowCircle from "@expo/vector-icons/FontAwesome5";
import { useAuth } from "../context/AuthContext";
import LoadingIndicator from "../components/LoadingIndicator";
import { signup } from "../api/auth";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import OtherFeaturesVideo from "../assets/videos/OTHER-FEATURES.mp4";
import CreateRigVideo from "../assets/videos/CREATE-RIG.mp4";
import CreateLogVideo from "../assets/videos/CREATE-LOG.mp4";
export default function SignUp() {
  const { login } = useAuth();
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const videos = [
    {
      title: "Create Rigs",
      source: CreateRigVideo,
    },
    {
      title: "Log Catches",
      source: CreateLogVideo,
    },
    {
      title: "Other Features",
      source: OtherFeaturesVideo,
    },
  ];
  const currentVideo = videos[videoIndex];
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [, setPreferences] = useState({
    notificationsEnabled: false,
    locationEnabled: false,
  });
  const player = useVideoPlayer(currentVideo.source, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });
  if (loading) {
    return (
      <GradientBackground>
        <View style={styles.centerState}>
          <LoadingIndicator text="Signing Up" color="#fff" />
        </View>
      </GradientBackground>
    );
  }

  async function handleEnableLocationServices() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const enabled = status === "granted";

      await SecureStore.setItemAsync(
        "locationEnabled",
        enabled ? "true" : "false",
      );

      setIndex(4);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }

  async function handleDisableLocationServices() {
    try {
      await SecureStore.setItemAsync("locationEnabled", "false");

      setIndex(4);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }

  async function handleEnableNotifications() {
    try {
      await SecureStore.setItemAsync("notificationsEnabled", "true");

      setPreferences((prev) => ({
        ...prev,
        notificationsEnabled: true,
      }));

      setIndex(3);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }

  async function handleDisableNotifications() {
    try {
      await SecureStore.setItemAsync("notificationsEnabled", "false");

      setPreferences((prev) => ({
        ...prev,
        notificationsEnabled: false,
      }));

      setIndex(3);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }
  function handleChange(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleButtonClick() {
    const isLastSlide = index === 4;
    if (!isLastSlide) setIndex(index + 1);
  }

  async function handleSubmit() {
    if (loading) return;
    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    try {
      setLoading(true);

      const data = await signup(form.username, form.password, form.email, {
        notificationsEnabled: false,
        locationEnabled: false,
        expoPushToken: null,
      });

      login(data);
      setIndex(2);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          enableOnAndroid
          extraScrollHeight={200}
          keyboardShouldPersistTaps="always"
          nestedScrollEnabled={true}
          keyboardDismissMode="on-drag"
        >
          {index === 0 ? (
            <View style={styles.welcomeContainer}>
              <Image
                source={require("../assets/images/FishQuest-Logo-only.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.header}>Welcome To Fish Quest!</Text>
              <View style={styles.videoColumn}>
                <Text style={styles.videoSubHeader}>{currentVideo.title}</Text>
                <View style={styles.videoContainer}>
                  <View style={styles.videoClip}>
                    <VideoView
                      nativeControls={false}
                      player={player}
                      style={styles.video}
                      allowsFullscreen={false}
                      allowsPictureInPicture={false}
                    />
                  </View>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 12,
                  justifyContent: "center",
                  paddingBottom: 20,
                }}
              >
                {videos.map((_, i) => (
                  <Pressable
                    key={i}
                    hitSlop={10}
                    onPress={() => setVideoIndex(i)}
                    style={[
                      styles.sliderButton,
                      videoIndex === i && styles.sliderButtonActive,
                    ]}
                  />
                ))}
              </View>
              <Pressable
                style={styles.orangeButton}
                onPress={handleButtonClick}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </Pressable>
            </View>
          ) : index === 1 ? (
            <View style={styles.formContainer}>
              <Link href="/" asChild>
                <Pressable style={styles.backButton}>
                  <LeftArrowCircle
                    name="arrow-circle-left"
                    size={30}
                    color="white"
                  />
                </Pressable>
              </Link>
              <View style={styles.logoWrap}>
                <Image
                  source={require("../assets/images/FishQuest-Logo-only.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={form.username}
                onChangeText={(text) => handleChange("username", text)}
                placeholder="Username"
                placeholderTextColor="#666"
                autoCapitalize="none"
              />
              <Text style={styles.label}>Email address</Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(text) => handleChange("email", text)}
                placeholder="Enter email"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={form.password}
                onChangeText={(text) => handleChange("password", text)}
                placeholder="Password"
                textContentType="password"
                autoCapitalize="none"
                placeholderTextColor="#666"
                secureTextEntry
              />
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={form.confirmPassword}
                onChangeText={(text) => handleChange("confirmPassword", text)}
                placeholder="Confirm Password"
                textContentType="password"
                autoCapitalize="none"
                placeholderTextColor="#666"
                secureTextEntry
              />
              <View style={styles.submitWrap}>
                <Pressable style={styles.orangeButton} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
              </View>
            </View>
          ) : index === 2 ? (
            <View style={styles.welcomeContainer}>
              <Image
                source={require("../assets/images/FishQuest-Logo-only.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.header}>Enable Notifications?</Text>
              <Text style={styles.subHeader}>
                This is used to receive updates from your buddies and for timed
                challenges/events.(We won't spam you, we promise!)
              </Text>
              <View style={{ flexDirection: "column", gap: 12, marginTop: 12 }}>
                <Pressable
                  style={styles.blueButton}
                  onPress={handleEnableNotifications}
                >
                  <Text style={styles.buttonText}>Yes</Text>
                </Pressable>
                <Pressable
                  style={styles.orangeButton}
                  onPress={handleDisableNotifications}
                >
                  <Text style={styles.buttonText}>No</Text>
                </Pressable>
              </View>
            </View>
          ) : index === 3 ? (
            <View style={styles.welcomeContainer}>
              <Image
                source={require("../assets/images/FishQuest-Logo-only.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.header}>Enable Location Services?</Text>
              <Text style={styles.subHeader}>
                Used to autofill your location
              </Text>
              <View style={{ flexDirection: "column", gap: 12, marginTop: 12 }}>
                <Pressable
                  style={styles.blueButton}
                  onPress={handleEnableLocationServices}
                >
                  <Text style={styles.buttonText}>Yes</Text>
                </Pressable>
                <Pressable
                  style={styles.orangeButton}
                  onPress={handleDisableLocationServices}
                >
                  <Text style={styles.buttonText}>No</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.welcomeContainer}>
              <Image
                source={require("../assets/images/rig-preset-example.png")}
                style={styles.exampleImage}
                resizeMode="contain"
              />
              <Text style={styles.header}>Create your first rig?</Text>
              <Text style={styles.subHeader}>
                Used to quickly log catches with a pre-saved rig. You can create
                more rigs later in your profile.
              </Text>
              <View style={{ flexDirection: "column", gap: 12, marginTop: 12 }}>
                <Pressable
                  style={styles.blueButton}
                  onPress={() => router.replace("/create-rig")}
                >
                  <Text style={styles.buttonText}>Yes</Text>
                </Pressable>
                <Pressable
                  style={styles.orangeButton}
                  onPress={() => router.replace("/home")}
                >
                  <Text style={styles.buttonText}>No</Text>
                </Pressable>
              </View>
            </View>
          )}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  blueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    width: 250,
    paddingHorizontal: 30,
    boxShadow: "0px 4px 0px #003f73",
    shadowColor: COLORS.primaryDropShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
  },
  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    padding: 24,
    width: "100%",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    padding: 24,
  },
  sliderButton: {
    width: 15,
    height: 15,
    borderRadius: 9999,
    padding: 5,
    backgroundColor: "#fff",
    opacity: 0.5,
  },
  sliderButtonActive: {
    opacity: 1,
    backgroundColor: COLORS.primary,
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  exampleImage: {
    width: 300,
    height: 200,
  },
  header: {
    color: "#fff",
    fontSize: 28,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 20,
  },
  subHeader: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  videoSubHeader: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  label: {
    color: "#fff",
    marginBottom: 6,

    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    color: "#000",
  },
  orangeButton: {
    boxShadow: "0px 4px 0px #733800",

    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignItems: "center",
    minWidth: 80,
    shadowColor: COLORS.secondaryDropShadow,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Jua",
    textAlign: "center",
  },
  submitWrap: {
    alignItems: "center",
    marginTop: 24,
  },
  backButton: {
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  videoColumn: {
    flexDirection: "column",
    display: "flex",
    paddingBottom: 20,
  },
  videoClip: {
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
  },
  videoContainer: {
    width: 400,
    height: 400,
    overflow: "hidden",
    marginTop: 12,
    borderRadius: 20,
    padding: 4,
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
