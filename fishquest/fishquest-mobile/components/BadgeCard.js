import { Pressable, Image, StyleSheet, View } from "react-native";

export default function BadgeCard({ badge, unlocked, onClick, preview }) {
  return (
    <Pressable
      onPress={onClick}
      style={[
        unlocked ? styles.unlockedCard : styles.lockedCard,
        preview ? styles.previewCard : styles.card,
      ]}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={badge.icon}
          style={[styles.image, !unlocked && styles.lockedImage]}
          resizeMode="contain"
        />
      </View>
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
  unlockedCard: {
    backgroundColor: "#dedede",
  },
  lockedCard: {
    backgroundColor: "#0f0f0f",
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
