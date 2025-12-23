import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import { BADGES } from "../data/badges.config";
import BadgeCard from "../components/BadgeCard";
const userStats = {
  total_catches: 7,
  baitcaster_count: 12,
  bluegill_count: 3,
};
function getProgressValue(type) {
  return userStats[type] ?? 0;
}
export default function BadgesPage() {
  return (
    <>
      <Navbar className="topNavbar d-flex align-items-center justify-content-between position-relative px-3 py-2">
        <Link to="/">
          <i className="bi bi-arrow-left-circle-fill"></i>
        </Link>

        <h1 className="position-absolute start-50 translate-middle-x fw-bold m-0">
          Badges
        </h1>
      </Navbar>
      <BottomBar />
      <div className="badge-grid">
        {BADGES.map((badge) => {
          const current = getProgressValue(badge.requirement.type);
          const needed = badge.requirement.value;
          const unlocked = current >= needed;

          return (
            <BadgeCard
              key={badge.id}
              badge={badge}
              unlocked={unlocked}
              current={current}
              needed={needed}
            />
          );
        })}
      </div>
    </>
  );
}
