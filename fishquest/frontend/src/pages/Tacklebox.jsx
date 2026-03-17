import { Navbar, ProgressBar, Container, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import { fetchRigPresets } from "../api/rigPresets";
import { getToken } from "../api/auth";
import { useEffect, useMemo, useState } from "react";
import Bobber from "../assets/img/Bobbers/bobber.png";
import NoBobber from "../assets/img/Bobbers/no-bobber.png";
import { BAIT } from "../data/bait.config";
import { HOOKS } from "../data/hooks.config";
import { POLES } from "../data/poles.config";
import { WEIGHTS } from "../data/weight.config";
import { fetchRigStats } from "../api/rigStats";
export default function Tacklebox() {
  const [rigs, setRigs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rigStats, setRigStats] = useState(null);
  const successRate =
    rigStats?.timesUsed > 0
      ? Math.min((rigStats.fishCaught / rigStats.timesUsed) * 100, 100)
      : 0;

  const trophyRate =
    rigStats?.fishCaught > 0
      ? Math.min((rigStats.bigFishCaught / rigStats.fishCaught) * 100, 100)
      : 0;

  const versatility = Math.min(((rigStats?.speciesCaught ?? 0) / 5) * 100, 100);

  useEffect(() => {
    (async () => {
      const token = getToken();
      if (!token) return;

      const data = await fetchRigPresets(token);
      setRigs(Array.isArray(data) ? data : []);
      setSelectedIndex(0);
    })();
  }, []);
  const hydratedRigs = useMemo(() => {
    return rigs.map((p) => ({
      ...p,
      hook: HOOKS.find((x) => x.id === p.hookId),
      bait: BAIT.find((x) => x.id === p.baitId),
      pole: POLES.find((x) => x.id === p.poleId),
      weight: WEIGHTS.find((x) => x.id === p.weightId),
    }));
  }, [rigs]);

  const selectedRig = hydratedRigs[selectedIndex];
  useEffect(() => {
    async function loadRigStats() {
      try {
        const token = getToken();
        if (!token || !selectedRig?._id) {
          setRigStats(null);
          return;
        }

        const data = await fetchRigStats(selectedRig._id, token);
        setRigStats(data);
      } catch (error) {
        console.error("Failed to fetch rig stats:", error);
        setRigStats(null);
      }
    }
    loadRigStats();
  }, [selectedRig]);

  const prevRig = () => {
    if (!hydratedRigs.length) return;
    setSelectedIndex(
      (i) => (i - 1 + hydratedRigs.length) % hydratedRigs.length,
    );
  };
  const nextRig = () => {
    if (!hydratedRigs.length) return;
    setSelectedIndex((i) => (i + 1) % hydratedRigs.length);
  };
  return (
    <>
      <Navbar className="topNavbar d-flex align-items-center justify-content-between position-relative px-3 py-2">
        <Link to="/">
          <i className="bi bi-arrow-left-circle-fill"></i>
        </Link>
        <h1 className="position-absolute start-50 translate-middle-x fw-bold m-0">
          Tacklebox
        </h1>
        <Link to="/create-rig">
          <Button className="orangeButton">New Rig</Button>
        </Link>
      </Navbar>
      <BottomBar />
      <Container className="bottomNavbarSpacing">
        {!selectedRig ? (
          <div className="p-4 text-center">
            <p>No rigs yet.</p>
            <Link to="/create-rig">
              <Button className="orangeButton">Create your first rig</Button>
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column p-2">
            <div className="d-flex flex-column gap-4 mt-4 justify-content-start">
              <div className="d-flex flex-row gap-4 align-items-center">
                {/*RIG PREVIEW*/}

                <div key={selectedRig._id}>
                  <div className="d-flex flex-column">
                    <div
                      className="d-flex align-items-start flex-column"
                      style={{ width: "9rem" }}
                    >
                      <div className="rigPresetText d-flex flex-row align-items-center">
                        <i
                          className="bi bi-caret-left-fill"
                          onClick={prevRig}
                        ></i>
                        <h2 className="m-0">{selectedRig.rigName}</h2>
                        <i
                          className="bi bi-caret-right-fill"
                          onClick={nextRig}
                        ></i>
                      </div>
                      <div className="rigImageContainer">
                        <Image
                          src={selectedRig.pole?.image}
                          alt={selectedRig.pole?.name}
                          style={{
                            width: "100%",
                            height: "auto",
                            overflow: "hidden",
                          }}
                        />
                      </div>
                    </div>
                    <Link to={`/edit-rig/${selectedRig._id}`}>
                      <Button
                        className="orangeButton"
                        style={{ width: "3rem" }}
                      >
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>

                {/*RIG OPTIONS*/}
                <div className="d-flex flex-row gap-3 ms-5">
                  <div className="d-flex flex-column gap-3">
                    <div className="smallSquare">
                      <Image
                        src={selectedRig.bobber ? Bobber : NoBobber}
                        alt={selectedRig.bobber ? "Bobber On" : "No Bobber"}
                        style={{
                          width: "100%",
                          height: "auto",
                          overflow: "hidden",
                        }}
                      />
                    </div>
                    <div className="smallSquare">
                      <Image
                        src={selectedRig.bait?.image}
                        alt={selectedRig.bait?.name}
                        style={{
                          width: "100%",
                          height: "auto",
                          overflow: "hidden",
                        }}
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-column gap-3">
                    <div className="smallSquare">
                      <Image
                        src={selectedRig.hook?.image}
                        alt={selectedRig.hook?.name}
                        style={{
                          width: "100%",
                          height: "auto",
                          overflow: "hidden",
                        }}
                      />
                    </div>
                    <div className="smallSquare">
                      <Image
                        src={selectedRig.weight?.image}
                        alt={selectedRig.weight?.name}
                        style={{
                          width: "100%",
                          height: "auto",
                          overflow: "hidden",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*RIG STATS*/}
            <h2 className="text-center">Rig Stats</h2>

            {/*VISUAL STATS*/}
            <div className="p-4 d-flex flex-column gap-3">
              <div className="py-3 gap-3 d-flex flex-column">
                <div className="d-flex flex-row gap-2">
                  <h4>Fish Caught:</h4>
                  <h4>{rigStats?.fishCaught ?? 0}</h4>
                </div>
                <div className="d-flex flex-row gap-2">
                  <h4>Times Skunked:</h4>
                  <h4>{rigStats?.skunked ?? 0}</h4>
                </div>
                <div className="d-flex flex-row gap-2">
                  <h4>Challenges Completed:</h4>
                  <h4>{rigStats?.challengesCompleted ?? 0}</h4>
                </div>
                <div className="d-flex flex-row gap-2">
                  <h4>Avg. Fish Weight:</h4>
                  <h4>
                    {rigStats?.avgWeight ? `${rigStats.avgWeight} LB` : "0 LB"}
                  </h4>
                </div>
                <div className="d-flex flex-row gap-2">
                  <h4>Avg. Fish Length:</h4>
                  <h4>
                    {rigStats?.avgLength ? `${rigStats.avgWeight} IN` : "0 IN"}
                  </h4>
                </div>
                <div className="d-flex flex-row gap-2">
                  <h4>Morning Catches:</h4>
                  <h4>{rigStats?.fishCaughtMorning}</h4>
                </div>
                <div className="d-flex flex-row gap-2">
                  <h4>Day Catches:</h4>
                  <h4>{rigStats?.fishCaughtDay}</h4>
                </div>
                <div className="d-flex flex-row gap-2">
                  <h4>Night Catches:</h4>
                  <h4>{rigStats?.fishCaughtNight}</h4>
                </div>
              </div>
              <div className="d-flex flex-column gap-1">
                <h4>Versatility</h4>
                <ProgressBar now={versatility} />
              </div>
              <div className="d-flex flex-column gap-1">
                <h4>Success Rate:</h4>
                <ProgressBar now={successRate} />
              </div>
              <div className="d-flex flex-column gap-1">
                <h4>Trophy Potential:</h4>
                <ProgressBar now={trophyRate} />
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
