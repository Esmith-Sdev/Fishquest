import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { COLORS, RADIUS } from "../constants/theme";
import { Image } from "react-native";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
export default function AuthForm({
  buttonText,
  onSubmit,
  footerText,
  footerLinkText,
  footerHref,
  errorText,
  onBiometricLogin,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {
    if (!email.trim() || !password.trim()) return;
    onSubmit(email.trim(), password);
  }

  return (
    <View style={styles.card}>
      <Image
        source={require("../assets/images/FishQuest-Logo-only.png")}
        style={{ width: 120, height: 120, resizeMode: "contain" }}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#666"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        textContentType="password"
        autoComplete="password"
        placeholderTextColor="#666"
        autoCapitalize="none"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={{ flexDirection: "column", gap: 12, alignItems: "center" }}>
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </Pressable>
        <Pressable style={styles.biometricButton} onPress={onBiometricLogin}>
          <Ionicons name="finger-print" size={50} color="black" />{" "}
        </Pressable>
      </View>
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>{footerText} </Text>
        <Link href={footerHref} style={styles.link}>
          {footerLinkText}
        </Link>
      </View>
      {errorText && (
        <Text style={styles.errorText}>Invalid Username or Password</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "100%",
  },
  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F6A623",
    marginBottom: 8,
    textAlign: "center",
  },

  biometricButton: {
    backgroundColor: COLORS.primary,
    opacity: 0.8,
    borderRadius: 9999,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ffffff",
    boxShadow: "0px 0px 10px #3ea2ff",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.pill,
    paddingHorizontal: 14,
    color: "#000",
    paddingVertical: 14,
    marginBottom: 12,
    fontSize: 16,
    width: "100%",
    maxWidth: 400,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 25,
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
    flexWrap: "wrap",
  },
  footerText: {
    color: "#D8E2E5",
  },
  link: {
    color: "#F6A623",
    fontWeight: "700",
  },
  errorText: {
    color: "red",
  },
});
