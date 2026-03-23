import { StyleSheet } from "react-native";
import { COLORS, RADIUS, TYPOGRAPHY } from "../constants/theme";

export const ui = StyleSheet.create({
  screen: {
    flex: 1,
    position: absolute,
  },

  title: {
    fontFamily: TYPOGRAPHY.heading,
    color: COLORS.text,
    fontSize: 24,
    margin: 0,
  },

  subtitle: {
    fontFamily: TYPOGRAPHY.body,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },

  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  secondaryButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  buttonText: {
    color: COLORS.textDark,
    fontFamily: TYPOGRAPHY.heading,
    fontSize: 16,
  },

  pillInput: {
    backgroundColor: COLORS.mutedSurface,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.textDark,
    fontFamily: TYPOGRAPHY.body,
  },

  card: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: 12,
  },

  darkCard: {
    backgroundColor: COLORS.surface1,
    borderRadius: RADIUS.md,
    padding: 12,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },
});
