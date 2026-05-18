import { Modal, View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { COLORS } from "../constants/theme";
import { router } from "expo-router";
import { enableBiometrics } from "../utils/AuthStorage";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { RADIUS } from "../constants/theme";
export default function SettingsModal({ visible, onClose, onLogOut }) {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function check() {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        const bioEnabled = await SecureStore.getItemAsync("biometricEnabled");
        if (!mounted) return;
        setSupported(!!hasHardware && !!enrolled);
        setEnabled(bioEnabled === "true");
      } catch (err) {
        // ignore
      }
    }
    if (visible) check();
    return () => {
      mounted = false;
    };
  }, [visible]);

  function handleReportBugPressed() {
    onClose();
    router.push("/BugForm");
  }

  async function handleEnablePressed() {
    try {
      await enableBiometrics();
      await SecureStore.setItemAsync("biometricPromptShown", "true");
      setEnabled(true);
      Alert.alert("Success", "Biometric login enabled");
      onClose();
    } catch (err) {
      Alert.alert("Error", err.message || "Could not enable biometrics");
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} style={styles.overlay}>
        <Pressable onPress={(e) => e.stopPropagation()} style={styles.box}>
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>

            <View style={{ position: "absolute", right: -10, top: -10 }}>
              <Pressable onPress={onClose} style={styles.button}>
                <MaterialIcons
                  name="cancel"
                  size={30}
                  color={COLORS.secondary}
                />{" "}
              </Pressable>
            </View>
          </View>
          <View style={styles.body}>
            <Pressable
              onPress={handleReportBugPressed}
              style={styles.blueButton}
            >
              <Text style={styles.buttonText}>Report a Bug</Text>
            </Pressable>
            <Pressable
              onPress={handleEnablePressed}
              style={[
                styles.blueButton,
                (!supported || enabled) && { opacity: 0.5 },
              ]}
              disabled={!supported || enabled}
            >
              <Text style={styles.buttonText}>
                {enabled ? "Biometrics Enabled" : "Enable Biometrics"}
              </Text>
            </Pressable>
          </View>
          <View style={styles.footer}>
            <Pressable onPress={onLogOut} style={styles.orangeButton}>
              <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  box: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },

  body: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 15,
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#dedede",
  },
  title: {
    fontSize: 18,
    fontFamily: "Jua",
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
  },

  orangeButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    boxShadow: "0px 4px 0px #733800",

    paddingHorizontal: 12,
    shadowColor: COLORS.secondaryDropShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
    zIndex: 10,
  },
  blueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    width: 150,
    paddingHorizontal: 10,
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
  buttonText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 15,
    textAlign: "center",
  },
});
