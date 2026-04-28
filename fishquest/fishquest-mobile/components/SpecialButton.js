import { Animated, Pressable, Text, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";
import { COLORS } from "../constants/theme";
export default function VeryHardButton({ onPress }) {
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  const glowStyle = {
    shadowOpacity: glow.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.9],
    }),
    shadowRadius: glow.interpolate({
      inputRange: [0, 1],
      outputRange: [6, 18],
    }),
    elevation: glow.interpolate({
      inputRange: [0, 1],
      outputRange: [4, 12],
    }),
  };

  return (
    <Animated.View style={[styles.wrapper, glowStyle]}>
      <Pressable onPress={onPress} style={styles.button}>
        <Text style={styles.text}>LOG</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 18,
    shadowColor: "#ff8c2e",
    shadowOffset: { width: 0, height: 0 },
  },

  button: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    paddingVertical: 4,
    paddingHorizontal: 18,
    minWidth: 80,

    marginTop: 4,
    shadowColor: COLORS.secondaryDropShadow,
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
    fontSize: 13,
    fontFamily: "Jua",
    textAlign: "center",
  },
});
