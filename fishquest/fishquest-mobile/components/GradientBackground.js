import { View, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";

export default function GradientBackground({ children }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 10000,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 5000,
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
    outputRange: [-240, 0],
  });

  return (
    <View style={styles.container}>
      <View style={styles.clip}>
        <Animated.View
          style={[styles.gradientWrap, { transform: [{ translateX }] }]}
        >
          <LinearGradient
            colors={["#2b537a", "#1f3246", "#204452", "#23d5ab"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </Animated.View>
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  clip: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  gradientWrap: {
    position: "absolute",
    width: "200%",
    height: "100%",
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
