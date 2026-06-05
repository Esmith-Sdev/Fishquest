import {
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { COLORS } from "../constants/theme";
import { LinearGradient } from "expo-linear-gradient";

import { useState } from "react";
const screenWidth = Dimensions.get("window").width;
const CARD_GAP = 12;
const CARD_SIZE = (screenWidth - 24 - CARD_GAP * 2) / 3;
export default function BadgeCard({ badge, unlocked, onClick, preview }) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <TouchableOpacity
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
          {imageLoading && (
            <View style={styles.centerState}>
              <ActivityIndicator color={COLORS.primary} />
            </View>
          )}

          {badge.icon ? (
            <Image
              source={badge.icon}
              style={[styles.image, !unlocked && styles.lockedImage]}
              resizeMode="contain"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={(e) => {
                setImageLoading(false);
              }}
            />
          ) : (
            <Text style={{ color: "white" }}>No Icon</Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
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
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 5,
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
