import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { COLORS, RADIUS } from "../constants/theme";

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
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.biometricButton}
          onPress={onBiometricLogin}
        >
          <Ionicons name="finger-print" size={50} color="black" />{" "}
        </TouchableOpacity>
      </View>
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>{footerText} </Text>
        <Link href={footerHref} asChild>
          <TouchableOpacity hitSlop={20}>
            <Text style={styles.link}>{footerLinkText}</Text>
          </TouchableOpacity>
        </Link>
      </View>
      {errorText && (
        <Text style={styles.errorText}>Invalid Username or Password</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "100%",
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
    marginTop: 25,
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
