import { StyleSheet , View, Pressable, Text } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { RADIUS , COLORS } from "../constants/theme";

import { router } from "expo-router";
export default function TopNavbarSecondary({
  title,
  buttonText,
  showButton = true,
  disabled = false,
  loading = false,
  // right button
  onButtonPress,
  buttonRoute,

  // back button
  onBackPress,
  backRoute = "/home",
}) {
  function handleRightButton() {
    if (onButtonPress) {
      onButtonPress();
    } else if (buttonRoute) {
      router.push(buttonRoute);
    }
  }

  function handleBack() {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(backRoute);
    }
  }

  return (
    <View style={styles.header}>
      <Pressable style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back-circle" size={30} color="#fff" />
      </Pressable>

      <Text style={styles.headerTitle}>{title}</Text>

      {showButton ? (
        <Pressable
          style={[
            styles.orangeButton,
            (disabled || loading) && styles.disabledButton,
          ]}
          onPress={handleRightButton}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </Pressable>
      ) : (
        <View style={styles.sideButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 24,
    fontWeight: "400",
    fontFamily: "Jua",
    color: "#fff",
    left: 0,
    right: 0,
    position: "absolute",
    textAlign: "center",
  },
  backButton: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
    zIndex: 10,
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
    zIndex: 10,
  },
  disabledButton: {
    backgroundColor: COLORS.secondaryDropShadow,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: COLORS.secondaryDropShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
    zIndex: 10,
  },
  buttonText: {
    color: "#000",
    fontFamily: "Jua",
    fontSize: 15,
    textAlign: "center",
  },
});
