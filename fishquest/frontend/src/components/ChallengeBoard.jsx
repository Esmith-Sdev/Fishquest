import { Container, ProgressBar, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
export default function ChallengeBoard() {
  return (
    <div className="p-4">
      <div
        style={{
          background: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          borderRadius: "15px",
          padding: ".5rem",
          gap: "1rem",
        }}
      >
        <h1 style={{ textDecoration: "underline", color: "black" }}>
          CHALLENGES
        </h1>
        <div
          style={{
            background: "#B2B2B2",
            padding: "1rem 1rem",
            display: "flex",
            flexDirection: "column",
            borderRadius: "15px",
            alignItems: "center",
            width: "100%",
            position: "relative",
          }}
        >
          <span className="challengeXP">+1500xp</span>
          <div className="d-flex flex-row gap-3 align-items-center justify-content-center">
            <div className="circle"></div>
            <h4 style={{ color: "black", margin: "0" }}>
              Catch a fish in 10min
            </h4>
          </div>
          <div className="d-flex align-items-center gap-2 w-100">
            <i className="bi-play-circle-fill"></i>
            <span style={{ color: "black", fontSize: "0.9rem" }}>2:00</span>
            <ProgressBar now={60} style={{ height: "1rem", flex: 1 }} />
          </div>
          <Link to="/create-log">
            <Button className="orangeButton" style={{ width: "5rem" }}>
              LOG
            </Button>
          </Link>
        </div>
        <div
          style={{
            background: "#B2B2B2",
            padding: "1rem 1rem",
            display: "flex",
            flexDirection: "column",
            borderRadius: "15px",
            gap: ".5rem",
            alignItems: "center",
            width: "100%",
            position: "relative",
          }}
        >
          <span className="challengeXP">+1500xp</span>
          <div className="d-flex flex-row gap-3 align-items-center justify-content-center">
            <div className="circle"></div>
            <h4 style={{ color: "black", margin: "0" }}>Catch any fish</h4>
          </div>
          <div className="d-flex align-items-center gap-2 w-100">
            <span style={{ color: "black", fontSize: "0.9rem" }}>0/1</span>

            <ProgressBar now={60} style={{ height: "1rem", flex: 1 }} />
          </div>
          <Link to="/create-log">
            <Button className="orangeButton" style={{ width: "5rem" }}>
              LOG
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
