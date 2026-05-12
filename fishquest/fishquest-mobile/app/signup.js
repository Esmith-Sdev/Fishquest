import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import GradientBackground from "../components/GradientBackground";
import { COLORS, RADIUS } from "../constants/theme";
import LeftArrowCircle from "@expo/vector-icons/FontAwesome5";
import { useAuth } from "../context/AuthContext";
import LoadingIndicator from "../components/LoadingIndicator";
const API_URL = "https://fishquest.onrender.com";

export default function SignUp() {
  const { login } = useAuth();
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  if (loading) {
    return (
      <GradientBackground>
        <LoadingIndicator text="Signing Up" color="#fff" />
      </GradientBackground>
    );
  }

  function handleChange(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleButtonClick() {
    const isLastSlide = index === 1;
    if (!isLastSlide) setIndex(1);
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.toLowerCase().trim(),
          email: form.email.toLowerCase().trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Account Created!");
        login(data);
        router.replace("/login");
      } else if (res.status === 409) {
        Alert.alert(
          "Error",
          data.message || "That email is already registered",
        );
      } else {
        Alert.alert("Error", data.error || data.message);
      }
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
          extraScrollHeight={50}
        >
          {index === 0 ? (
            <View style={styles.welcomeContainer}>
              <Image
                source={require("../assets/images/FishQuest-Logo-only.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.header}>Welcome To Fish Quest!</Text>
              <Text style={styles.subHeader}>Lets get to know you better.</Text>
              <Pressable
                style={styles.orangeButton}
                onPress={handleButtonClick}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </Pressable>
            </View>
          ) : (
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
          )}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,

    justifyContent: "center",
  },
  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 16,
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
  logoWrap: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
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
  },
  orangeButton: {
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
  },
  submitWrap: {
    alignItems: "center",
    marginTop: 24,
  },
  backButton: {
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  backIcon: {
    width: "30px",
    height: "30px",
    BackgroundColor: "#fff",
    fontWeight: "700",
  },
});
