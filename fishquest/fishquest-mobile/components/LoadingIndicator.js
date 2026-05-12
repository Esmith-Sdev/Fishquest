import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import useLoadingDots from "../hooks/useLoadingDots";
import { COLORS } from "../constants/theme";

export default function LoadingIndicator({ text, color = "#fff" }) {
  const dots = useLoadingDots();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />

      <View style={styles.row}>
        <Text style={[styles.text, { color }]}>{text}</Text>
        <Text style={[styles.text, { color }]}>{dots}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  text: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Jua",
  },
});
