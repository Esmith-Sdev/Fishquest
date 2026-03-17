import { useEffect, useState } from "react";
import { ProgressBar, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import TimedChallengeModal from "./TimedChallengeModal";
export default function TimedChallengeCard({ challenge }) {
  const [showModal, setShowModal] = useState(false);
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div
      style={{
        background: "#B2B2B2",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        borderRadius: "15px",
        alignItems: "center",
        width: "100%",
        position: "relative",
      }}
    >
      <span className="challengeXP">+{challenge.rewardXp}XP</span>

      <h4 style={{ color: "black", margin: 0 }}>{challenge.title}</h4>

      <ProgressBar style={{ height: "1rem", width: "100%" }} />

      <div className="pt-2">
        <Button
          className="orangeButton"
          style={{ width: "5rem" }}
          onClick={() => setShowModal(true)}
        >
          Start
        </Button>
      </div>
      <TimedChallengeModal
        show={showModal}
        onHide={() => setShowModal(false)}
        challenge={challenge}
      />
    </div>
  );
}
