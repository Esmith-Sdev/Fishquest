import { View, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { RADIUS } from "@/constants/theme";
export default function VeryHardGradientCard({ children, style }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 0],
  });

  return (
    <View style={[styles.outer, style]}>
      <View style={styles.gradientClip}>
        <Animated.View
          style={[styles.gradientWrap, { transform: [{ translateX }] }]}
        >
          <LinearGradient
            colors={["#aaaaaa", "#dedede", "#aaaaaa"]}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.gradient}
          />
        </Animated.View>
      </View>

      {children}
    </View>
  );
}
const styles = StyleSheet.create({
  outer: {
    width: "100%",
    position: "relative",
  },
  gradientClip: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    borderRadius: RADIUS.md,
  },
  gradientWrap: {
    position: "absolute",
    width: "200%",
    height: "100%",
  },
  gradient: {
    flex: 1,
  },
});
