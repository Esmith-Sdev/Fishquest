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

export default function AuthForm({
  buttonText,
  onSubmit,
  footerText,
  footerLinkText,
  footerHref,
  errorText,
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
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Pressable>

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
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.pill,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    fontSize: 16,
    width: "100%",
    maxWidth: "40rem",
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
