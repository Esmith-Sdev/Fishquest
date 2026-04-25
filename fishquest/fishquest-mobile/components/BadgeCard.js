import { Pressable, Image, StyleSheet, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
const CARD_GAP = 12;
const CARD_SIZE = (screenWidth - 24 - CARD_GAP * 2) / 3;
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
          {badge.icon ? (
            <Image
              source={badge.icon}
              style={[styles.image, !unlocked && styles.lockedImage]}
              resizeMode="contain"
              onError={(e) =>
                console.log("Badge image failed:", badge.id, e.nativeEvent)
              }
            />
          ) : (
            <Text style={{ color: "white" }}>No Icon</Text>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
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
