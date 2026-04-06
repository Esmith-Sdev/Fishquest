import { View, StyleSheet, Pressable, Image } from "react-native";
import { COLORS } from "../constants/theme";
import { router } from "expo-router";
export default function BottomNavbar() {
  return (
    <View style={styles.container}>
      <View style={styles.iconsContainer}>
        <Pressable onPress={() => router.push("/home")}>
          <Image
            source={require("../assets/images/icons/Home.png")}
            style={styles.icon}
          ></Image>
        </Pressable>

        <Pressable onPress={() => router.push("/tacklebox")}>
          <Image
            source={require("../assets/images/icons/TackleBox.png")}
            style={styles.icon}
          ></Image>
        </Pressable>
        <Pressable onPress={() => router.push("/logs")}>
          <Image
            source={require("../assets/images/icons/Book.png")}
            style={styles.icon}
          ></Image>
        </Pressable>
        <Pressable onPress={() => router.push("/badges")}>
          <Image
            source={require("../assets/images/icons/Trophy.png")}
            style={styles.biggerIcon}
          ></Image>
        </Pressable>
        <Pressable onPress={() => router.push("/profile")}>
          <Image
            source={require("../assets/images/icons/Fisherman.png")}
            style={styles.biggerIcon}
          ></Image>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 15,
    backgroundColor: COLORS.primary,
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  biggerIcon: {
    width: 36,
    height: 36,
    resizeMode: "contain",
  },
});
