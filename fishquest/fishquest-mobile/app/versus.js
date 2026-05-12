import TopNavbarSecondary from "../components/TopNavbarSecondary";
import BottomNavbar from "../components/BottomNavbar";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/theme";
export default function Versus() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <TopNavbarSecondary title="Versus" buttonText="Create Match" />
      <BottomNavbar />
    </SafeAreaView>
  );
}
