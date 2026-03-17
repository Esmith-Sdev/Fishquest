import { Navbar, Button, Image, Container, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import LeftArrow from "../assets/img/Icons/LeftArrow.png";
import RightArrow from "../assets/img/Icons/RightArrow.png";
import { useState, useEffect } from "react";
import { BAIT } from "../data/bait.config";
import { POLES } from "../data/poles.config";
import { WEIGHTS } from "../data/weight.config";
import { HOOKS } from "../data/hooks.config";
import Bobber from "../assets/img/Bobbers/bobber.png";
import NoBobber from "../assets/img/Bobbers/no-bobber.png";
import { updateRigPreset } from "../api/rigPresets";
import { fetchRigPresets } from "../api/rigPresets";
import { getToken } from "../api/auth";

export default function EditRig() {
  const { rigId } = useParams();
  const navigate = useNavigate();

  const [rig, setRig] = useState(null);
  const [loading, setLoading] = useState(true);

  const [poleId, setPoleId] = useState(POLES[0].id);
  const [baitId, setBaitId] = useState(BAIT[0].id);
  const [hookId, setHookId] = useState(HOOKS[0].id);
  const [weightId, setWeightId] = useState(WEIGHTS[0].id);
  const [rigName, setRigName] = useState("");
  const [bobber, setBobber] = useState(false);

  const [polesIndex, setPolesIndex] = useState(0);
  const [baitIndex, setBaitIndex] = useState(0);
  const [weightIndex, setWeightIndex] = useState(0);
  const [hookIndex, setHookIndex] = useState(0);

  const currentPole = POLES[polesIndex];
  const currentBait = BAIT[baitIndex];
  const currentWeight = WEIGHTS[weightIndex];
  const currentHook = HOOKS[hookIndex];

  const nextPole = () => setPolesIndex((prev) => (prev + 1) % POLES.length);
  const prevPole = () =>
    setPolesIndex((prev) => (prev - 1 + POLES.length) % POLES.length);

  const nextBait = () => setBaitIndex((prev) => (prev + 1) % BAIT.length);
  const prevBait = () =>
    setBaitIndex((prev) => (prev - 1 + BAIT.length) % BAIT.length);

  const nextWeight = () =>
    setWeightIndex((prev) => (prev + 1) % WEIGHTS.length);
  const prevWeight = () =>
    setWeightIndex((prev) => (prev - 1 + WEIGHTS.length) % WEIGHTS.length);

  const nextHook = () => setHookIndex((prev) => (prev + 1) % HOOKS.length);
  const prevHook = () =>
    setHookIndex((prev) => (prev - 1 + HOOKS.length) % HOOKS.length);

  const toggleBobber = () => setBobber((prev) => !prev);

  useEffect(() => {
    setPoleId(currentPole.id);
  }, [currentPole]);

  useEffect(() => {
    setBaitId(currentBait.id);
  }, [currentBait]);

  useEffect(() => {
    setHookId(currentHook.id);
  }, [currentHook]);

  useEffect(() => {
    setWeightId(currentWeight.id);
  }, [currentWeight]);

  useEffect(() => {
    async function loadRig() {
      try {
        const token = getToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const rigs = await fetchRigPresets(token);
        const foundRig = rigs.find((r) => (r._id || r.id) === rigId);

        if (foundRig) {
          setRig(foundRig);
          setRigName(foundRig.rigName || "");
          setBobber(!!foundRig.bobber);

          const poleIndex = POLES.findIndex((p) => p.id === foundRig.poleId);
          const baitIndex = BAIT.findIndex((b) => b.id === foundRig.baitId);
          const hookIndex = HOOKS.findIndex((h) => h.id === foundRig.hookId);
          const weightIndex = WEIGHTS.findIndex(
            (w) => w.id === foundRig.weightId,
          );

          if (poleIndex !== -1) setPolesIndex(poleIndex);
          if (baitIndex !== -1) setBaitIndex(baitIndex);
          if (hookIndex !== -1) setHookIndex(hookIndex);
          if (weightIndex !== -1) setWeightIndex(weightIndex);
        } else {
          setRig(null);
        }
      } catch (error) {
        console.error("Failed to load rig:", error);
        setRig(null);
      } finally {
        setLoading(false);
      }
    }

    loadRig();
  }, [rigId]);
  async function handleSave() {
    try {
      const token = getToken();
      if (!token) return;

      const updatedRig = {
        rigName,
        poleId,
        baitId,
        hookId,
        weightId,
        bobber,
      };
      await updateRigPreset(rigId, updatedRig, token);
      navigate("/tacklebox");
    } catch (error) {
      console.error("Failed to update rig:", error);
    }
  }
  if (loading) return <p>Loading...</p>;
  if (!rig) return <p>Rig not found.</p>;

  return (
    <>
      <Navbar className="topNavbar d-flex align-items-center justify-content-between position-relative px-3 py-2">
        <Link to="/">
          <i className="bi bi-arrow-left-circle-fill"></i>
        </Link>
        <h1 className="position-absolute start-50 translate-middle-x fw-bold m-0">
          Edit Rig
        </h1>
        <Button className="orangeButton" type="button" onClick={handleSave}>
          Save
        </Button>
      </Navbar>

      <BottomBar />

      <Container className="bottomNavbarSpacing">
        <div className="d-flex flex-column gap-2 p-3 align-items-center">
          <div className="p-3">
            <Form.Control
              className="pillInput medium text-center"
              type="text"
              placeholder="Preset Name"
              style={{ fontFamily: "Jua" }}
              onChange={(e) => setRigName(e.target.value)}
              value={rigName}
            />
          </div>

          <div className="d-flex flex-row gap-2 align-items-center justify-content-center">
            <Image
              style={{ width: "50px", height: "50px" }}
              src={LeftArrow}
              className="arrow-icon"
              onClick={prevPole}
            />

            <div className="rigImageContainer">
              <div className="d-flex flex-column">
                <Image
                  src={currentPole.image}
                  alt={currentPole.name}
                  style={{
                    width: "100%",
                    height: "auto",
                    overflow: "hidden",
                  }}
                />
              </div>
              <Form.Label className="text-center mt-1 w-100">
                {currentPole.name}
              </Form.Label>
            </div>

            <Image
              style={{ width: "50px", height: "50px" }}
              src={RightArrow}
              className="arrow-icon"
              onClick={nextPole}
            />
          </div>

          <div className="p-3">
            <Button className="orangeButton">Customize</Button>
          </div>
        </div>

        <div className="d-flex flex-column gap-5 p-5 align-items-center">
          <div className="d-flex flex-row gap-3 justify-content-center">
            <div className="d-flex flex-column gap-5">
              <div className="flex-rox d-flex gap-2 align-items-center">
                <Image
                  src={LeftArrow}
                  className="arrow-icon"
                  onClick={toggleBobber}
                />
                <div className="mediumSquare">
                  <Image
                    src={bobber ? Bobber : NoBobber}
                    alt={bobber ? "Bobber On" : "No Bobber"}
                    style={{
                      width: "100%",
                      height: "auto",
                      overflow: "hidden",
                    }}
                  />
                  <Form.Label className="text-center mt-1 w-100">
                    {bobber ? "Bobber" : "No Bobber"}
                  </Form.Label>
                </div>
                <Image
                  src={RightArrow}
                  className="arrow-icon"
                  onClick={toggleBobber}
                />
              </div>

              <div className="flex-rox d-flex gap-2 align-items-center">
                <Image
                  src={LeftArrow}
                  className="arrow-icon"
                  onClick={prevHook}
                />
                <div className="mediumSquare">
                  <Image
                    src={currentHook.image}
                    alt={currentHook.name}
                    style={{
                      width: "100%",
                      height: "auto",
                      overflow: "hidden",
                    }}
                  />
                  <Form.Label className="text-center mt-1 w-100">
                    {currentHook.name}
                  </Form.Label>
                </div>
                <Image
                  src={RightArrow}
                  className="arrow-icon"
                  onClick={nextHook}
                />
              </div>
            </div>

            <div className="d-flex flex-column gap-5">
              <div className="flex-rox d-flex gap-2 align-items-center">
                <Image
                  src={LeftArrow}
                  className="arrow-icon"
                  onClick={prevBait}
                />
                <div className="mediumSquare">
                  <Image
                    src={currentBait.image}
                    alt={currentBait.name}
                    style={{
                      width: "100%",
                      height: "auto",
                      overflow: "hidden",
                    }}
                  />
                  <Form.Label className="text-center mt-1 w-100">
                    {currentBait.name}
                  </Form.Label>
                </div>
                <Image
                  src={RightArrow}
                  className="arrow-icon"
                  onClick={nextBait}
                />
              </div>

              <div className="flex-rox d-flex gap-2 align-items-center">
                <Image
                  src={LeftArrow}
                  className="arrow-icon"
                  onClick={prevWeight}
                />
                <div className="mediumSquare">
                  <Image
                    src={currentWeight.image}
                    alt={currentWeight.name}
                    style={{
                      width: "100%",
                      height: "auto",
                      overflow: "hidden",
                    }}
                  />
                  <Form.Label className="text-center mt-1 w-100">
                    {currentWeight.name}
                  </Form.Label>
                </div>
                <Image
                  src={RightArrow}
                  className="arrow-icon"
                  onClick={nextWeight}
                />
              </div>
            </div>
          </div>

          <Button className="orangeButton">Customize</Button>
        </div>
      </Container>
    </>
  );
}
