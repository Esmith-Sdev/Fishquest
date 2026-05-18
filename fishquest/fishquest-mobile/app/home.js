import { View, Text, Pressable, StyleSheet, Image, Alert } from "react-native";

import TopNavbar from "../components/TopNavbar";
import BottomNavbar from "../components/BottomNavbar";
import DailyChallenges from "../components/DailyChallenges";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { COLORS } from "@/constants/theme";
export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View style={styles.screen}>
        <TopNavbar />
        <ScrollView contentContainerStyle={styles.content}>
          <DailyChallenges />
          <View style={styles.horizontalCardContainer}>
            <Pressable
              onPress={() =>
                Alert.alert("PvP coming soon!", "Feature not available in Beta")
              }
              style={styles.horizontalCard}
            >
              <Image
                style={styles.horizontalCardImage}
                source={require("../assets/images/vs.png")}
              ></Image>
            </Pressable>
          </View>
        </ScrollView>
        <BottomNavbar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0D1B1E",
  },
  content: {
    paddingBottom: 100,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#F6A623",
    marginBottom: 10,
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#008575",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  cardPressable: {
    width: "90%",
  },
  horizontalCardContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  horizontalCard: {
    width: "100%",
    height: 100,
    borderRadius: 15,
    overflow: "hidden",
    boxShadow: "0 0px 16px rgb(255, 94, 0)",
    justifyContent: "center",

    alignItems: "center",
  },
  horizontalCardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
});
