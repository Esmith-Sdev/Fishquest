import { Pressable, Image, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
export default function BadgeCard({ badge, unlocked, onClick, preview }) {
  return (
    <Pressable
      onPress={onClick}
      style={[preview ? styles.previewCard : styles.card]}
    >
      <LinearGradient
        colors={unlocked ? ["#ffffff", "#c7c7c7"] : ["#000", "#111111"]}
        style={[
          styles.gradient,
          unlocked ? styles.unlockedCard : styles.lockedCard,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={badge.icon}
            style={[styles.image, !unlocked && styles.lockedImage]}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 18,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  gradient: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  previewCard: {
    width: "75%",
    aspectRatio: 1,
    borderRadius: 18,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  lockedImage: {
    opacity: 0.45,
  },
});
