import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import TimedChallengeCard from "./TimedChallengeCard";
import ChallengeCard from "./ChallengeCard";
import TimedChallengeModal from "./TimedChallengeModal";
import {
  filterByDaily,
  limitChallenges,
} from "../utils/filterChallengeCategories";
export default function DailyChallenges() {
  const [challenges, setChallenges] = useState([]);
  const userId = localStorage.getItem("userId");
  const dailyChallenges = limitChallenges(filterByDaily(challenges), 3);
  useEffect(() => {
    if (!userId) {
      console.log("No userId found");
      return;
    }

    fetch(`http://localhost:3000/api/challenges/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("userId:", userId);
        console.log("challenge data:", data);
        setChallenges(data);
      })
      .catch((error) => console.error("fetch error:", error));
  }, [userId]);

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
          DAILY CHALLENGES
        </h1>
        {dailyChallenges.map((challenge) =>
          challenge.type === "timed" ? (
            <TimedChallengeCard key={challenge.id} challenge={challenge} />
          ) : (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ),
        )}
        <Link to="/challenges" className="pt-2">
          <Button className="orangeButton" style={{ width: "10rem" }}>
            All Challenges
          </Button>
        </Link>
      </div>
    </div>
  );
}
