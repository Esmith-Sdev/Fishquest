import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { COLORS } from "../constants/theme";
import { router } from "expo-router";
import { RADIUS } from "../constants/theme";
export default function SettingsModal({ visible, onClose, onLogOut }) {
  function handleReportBugPressed() {
    onClose();
    router.push("/BugForm");
  }
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
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
          </View>
          <View style={styles.footer}>
            <Pressable onPress={onLogOut} style={styles.orangeButton}>
              <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
          </View>
        </View>
      </View>
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
    height: 200,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
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
