import { Navbar, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import LevelImage from "../components/LevelImage";
import ChallengeBoard from "../components/ChallengeBoard";
export default function Level() {
  return (
    <>
      <Navbar className="topNavbar d-flex align-items-center justify-content-between position-relative px-3 py-2">
        <Link to="/">
          <i className="bi bi-arrow-left-circle-fill"></i>
        </Link>

        <h1 className="position-absolute start-50 translate-middle-x fw-bold m-0">
          Level Map
        </h1>
      </Navbar>
      <BottomBar />

      <div className="d-flex justify-content-center py-4 px-4">
        <LevelImage />
      </div>
      <ChallengeBoard />
    </>
  );
}
