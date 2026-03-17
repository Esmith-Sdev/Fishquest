import Topbar from "../components/Topbar";
import DailyChallenges from "../components/DailyChallenges";
import BottomBar from "../components/BottomBar";
import TipsBox from "../components/TipsBox";
export default function Home() {
  return (
    <>
      <div className="bottomNavbarSpacing">
        <Topbar />
        <BottomBar />
        <TipsBox />
        <DailyChallenges />
      </div>
    </>
  );
}
