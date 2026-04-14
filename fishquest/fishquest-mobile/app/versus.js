import TopNavbarSecondary from "../components/TopNavbarSecondary";
import BottomNavbar from "../components/BottomNavbar";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Versus() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D1B1E" }}>
      <TopNavbarSecondary title="Versus" buttonText="Create Match" />
      <BottomNavbar />
    </SafeAreaView>
  );
}
