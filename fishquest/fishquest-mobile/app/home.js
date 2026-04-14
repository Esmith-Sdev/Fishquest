import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import TopNavbar from "../components/TopNavbar";
import BottomNavbar from "../components/BottomNavbar";
import DailyChallenges from "../components/DailyChallenges";
import { SafeAreaView } from "react-native-safe-area-context";
export default function HomeScreen() {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D1B1E" }}>
      <View style={styles.container}>
        <TopNavbar />
        <BottomNavbar />
        <DailyChallenges />
        <Pressable
          style={styles.horizontalCard}
          onPress={() => router.push("/versus")}
        >
          <Image
            style={styles.horizontalCardImage}
            source={require("../assets/images/VersusImage.png")}
          ></Image>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B1E",

    alignItems: "center",
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

  horizontalCard: {
    width: "90%",
    height: 100,

    justifyContent: "center",
    alignItems: "center",
  },
  horizontalCardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
});
