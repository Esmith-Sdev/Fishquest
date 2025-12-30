import { Modal, Navbar, Button } from "react-bootstrap";
import { useState } from "react";
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
  const [show, setShow] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const handleClose = () => {
    setSelectedBadge(null);
    setShow(false);
  };
  const handleShow = (badge) => {
    setSelectedBadge(badge);
    setShow(true);
  };
  const current = selectedBadge
    ? getProgressValue(selectedBadge.requirement.type)
    : 0;
  const needed = selectedBadge ? selectedBadge.requirement.value : 0;
  const unlocked = selectedBadge ? current >= needed : false;
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
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedBadge?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBadge && (
            <BadgeCard
              badge={selectedBadge}
              unlocked={unlocked}
              current={current}
              needed={needed}
            />
          )}
          {selectedBadge && !unlocked && (
            <div className="mt-3 d-flex justify-content-center">
              Progress: {current}/{needed}
            </div>
          )}
        </Modal.Body>
      </Modal>
      <div className="bottomNavbarSpacing">
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
                onClick={() => handleShow(badge)}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
