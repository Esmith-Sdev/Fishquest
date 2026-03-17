import { useState, useEffect } from "react";
import { Navbar, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import TimedChallengeCard from "../components/TimedChallengeCard";
import ChallengeCard from "../components/ChallengeCard";
import TimedChallengeModal from "../components/TimedChallengeModal";
import BottomBar from "../components/BottomBar";
import {
  filterBySpecies,
  filterByTimed,
  filterByLuck,
  filterByRig,
  filterByAdventure,
  limitChallenges,
} from "../utils/filterChallengeCategories";
export default function ChallengePage() {
  const [challenges, setChallenges] = useState([]);
  const userId = localStorage.getItem("userId");
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(3);

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

  function getFilteredChallenges() {
    switch (activeFilter) {
      case "fish":
        return filterBySpecies(challenges);
      case "rig":
        return filterByRig(challenges);
      case "luck":
        return filterByLuck(challenges);
      case "timed":
        return filterByTimed(challenges);
      case "adventure":
        return filterByAdventure(challenges);
      default:
        return challenges;
    }
  }
  const filteredChallenges = getFilteredChallenges();
  const slicedChallenges = limitChallenges(filteredChallenges, visibleCount);
  useEffect(() => {
    setVisibleCount(3);
  }, [activeFilter]);
  return (
    <>
      <div className="bottomNavbarSpacing">
        <Navbar className="topNavbar d-flex align-items-center justify-content-between position-relative px-3 py-2">
          <Link to="/">
            <i className="bi bi-arrow-left-circle-fill"></i>
          </Link>
          <h1 className="position-absolute start-50 translate-middle-x fw-bold m-0">
            Challenges
          </h1>
        </Navbar>
        <BottomBar />
        <div className="p-4 d-flex justify-content-center flex-column">
          <div className="d-flex flex-row align-items-center gap-1 pb-3 justify-content-center">
            <h4 className="px-2">Filter:</h4>
            <Button
              className="filterButton sm"
              onClick={() => setActiveFilter("all")}
            >
              All
            </Button>
            <Button
              className="filterButton"
              onClick={() => setActiveFilter("fish")}
            >
              Fish
            </Button>
            <Button
              className="filterButton"
              onClick={() => setActiveFilter("luck")}
            >
              Luck
            </Button>
            <Button
              className="filterButton"
              onClick={() => setActiveFilter("rig")}
            >
              Rig
            </Button>
            <Button
              className="filterButton"
              onClick={() => setActiveFilter("timed")}
            >
              Timed
            </Button>
            <Button
              className="filterButton sm"
              onClick={() => setActiveFilter("adventure")}
            >
              Adventure
            </Button>
          </div>
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
              width: "100%",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <h1
              style={{
                textDecoration: "underline",
                color: "black",
                textTransform: "capitalize",
              }}
            >
              {activeFilter}
            </h1>
            {slicedChallenges.map((challenge) =>
              challenge.type === "timed" ? (
                <TimedChallengeCard key={challenge.id} challenge={challenge} />
              ) : (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ),
            )}
            <Button
              className="orangeButton"
              onClick={() => setVisibleCount(filteredChallenges.length)}
            >
              Show More
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
