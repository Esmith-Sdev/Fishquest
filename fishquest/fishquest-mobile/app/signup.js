import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, router } from "expo-router";
import GradientBackground from "../components/GradientBackground";
import { COLORS, RADIUS } from "../constants/theme";

const API_URL = "https://fishquest.onrender.com";

export default function SignUp() {
  const [index, setIndex] = useState(0);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  function handleChange(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleButtonClick() {
    const isLastSlide = index === 1;
    if (!isLastSlide) setIndex(1);
  }

  async function handleSubmit() {
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.toLowerCase().trim(),
          email: form.email.toLowerCase().trim(),
          password: form.password,
        }),
      });

      if (res.ok) {
        Alert.alert("Success", "Account Created!");
        router.replace("/login");
      } else if (res.status === 409) {
        Alert.alert("Error", "That email is already registered");
      } else {
        Alert.alert("Error", "Signup failed. Please try again.");
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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

            <Pressable style={styles.orangeButton} onPress={handleButtonClick}>
              <Text style={styles.buttonText}>Get Started</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Link href="/" asChild>
              <Pressable style={styles.backButton}>
                <Text style={styles.backText}>←</Text>
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
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
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
  },
  subHeader: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  label: {
    color: "#fff",
    marginBottom: 6,
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  orangeButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    minWidth: 140,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  submitWrap: {
    alignItems: "center",
    marginTop: 24,
  },
  backButton: {
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  backText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "700",
  },
});
