import { Navbar, Button, Image, ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import BadgeCard from "../components/BadgeCard";
import { BADGES } from "../data/badges.config";
export default function Profile() {
  const titles = [
    "Minnow Wrangler",
    "Pond Rookie",
    "Bobber Buddy",
    "Reel Recruit",
    "Hook Apprentice",
    "Line Caster",
    "Bait Specialist",
    "Tackle Technician",
    "Lure Adept",
    "Dock Adventurer",
    "Shoreline Scout",
    "River Ranger",
    "Lake Legend",
    "Deepwater Pro",
    "Tide Tamer",
    "Master Angler",
    "Mythic Fisher",
    "King of the Catch",
    "Reelmaster Supreme",
    "Fish God",
  ];
  const rank = 1;
  const setRankTitle = titles[rank - 1];

  return (
    <>
      <Navbar className="topNavbar d-flex align-items-center justify-content-between position-relative px-3 py-2">
        <Link to="/">
          <i className="bi bi-arrow-left-circle-fill"></i>
        </Link>

        <h1 className="position-absolute start-50 translate-middle-x fw-bold m-0">
          Profile
        </h1>

        <Button className="orangeButton">Settings</Button>
      </Navbar>
      <BottomBar />
      <div className="d-flex flex-row gap-2 p-2">
        <div className="profile-container d-flex flex-column">
          <div className="d-flex flex-column align-items-center">
            <h2>Username002</h2>
            <div className="rigImageContainer">
              <Image></Image>
            </div>
          </div>
          <Link to="edit-profile">
            <Button className="orangeButton">Customize</Button>
          </Link>
          <h2 className="my-3">Stats</h2>
          <div className="flex-column d-flex gap-4">
            <div className="d-flex flex-row gap-2">
              <h4>Personal Best:</h4>
              <h4>5.6lb</h4>
            </div>
            <div className="d-flex flex-row gap-2">
              <h4>Fish Caught:</h4>
              <h4>5</h4>
            </div>
            <div className="d-flex flex-row gap-2">
              <h4>Challenges Completed:</h4>
              <h4>5</h4>
            </div>
            <div className="d-flex flex-row gap-2">
              <h4>Favorite Bait:</h4>
              <h4>Frog</h4>
            </div>
          </div>
          <div className="badge-grid">
            <BadgeCard key={badge.id} badge={badge} />
          </div>
        </div>
        <div className="rank-container d-flex flex-column justify-content-center">
          <h5 className="rank-container-text mb-2">{setRankTitle}</h5>
          <ProgressBar now={60} label="XP" />
          <h5 className="rank-container-text mt-2">Level {rank}</h5>
        </div>
      </div>
    </>
  );
}
