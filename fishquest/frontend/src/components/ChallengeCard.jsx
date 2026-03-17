import { ProgressBar, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ChallengeCard({ challenge }) {
  const progress = challenge?.progress ?? 0;
  const goal = challenge?.goal ?? 1;
  const percent = goal ? (progress / goal) * 100 : 0;

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
      <span className="challengeXP">+{challenge?.rewardXp}XP</span>

      <h4 style={{ color: "black", margin: 0, padding: ".5rem" }}>
        {challenge?.title ?? "Challenge"}
      </h4>

      <ProgressBar now={percent} style={{ height: "1rem", width: "100%" }} />

      <Link to="/create-log" className="pt-2">
        <Button className="orangeButton" style={{ width: "5rem" }}>
          LOG
        </Button>
      </Link>
    </div>
  );
}
