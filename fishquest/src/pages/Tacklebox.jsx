import { Navbar, ProgressBar, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import BottomBar from "../components/BottomBar";
export default function Tacklebox() {
  return (
    <>
      <Navbar className="topNavbar d-flex align-items-center justify-content-between position-relative px-3 py-2">
        <Link to="/">
          <i className="bi bi-arrow-left-circle-fill"></i>
        </Link>
        <h1 className="position-absolute start-50 translate-middle-x fw-bold m-0">
          Tacklebox
        </h1>
        <Link to="/rig-preset">
          <Button className="orangeButton">New Rig</Button>
        </Link>
      </Navbar>
      <BottomBar />
      <Container className="bottomNavbarSpacing">
        <div className="d-flex flex-column p-2">
          <div className="d-flex flex-column gap-4 mt-4 justify-content-start">
            <div className="d-flex flex-row gap-4 align-items-center">
              {/*RIG PREVIEW*/}
              <div className="d-flex flex-column">
                <div
                  className="d-flex align-items-start flex-column"
                  style={{ width: "9rem" }}
                >
                  <div className="rigPresetText d-flex flex-row align-items-center">
                    <i className="bi bi-caret-left-fill"></i>
                    <h2 className="m-0">Rig Preset</h2>
                    <i className="bi bi-caret-right-fill"></i>
                  </div>
                  <div className="rigImageContainer"></div>
                </div>
                <Link to="/edit-rig">
                  <Button className="orangeButton" style={{ width: "3rem" }}>
                    Edit
                  </Button>
                </Link>
              </div>
              {/*RIG OPTIONS*/}
              <div className="d-flex flex-row gap-3 ms-5">
                <div className="d-flex flex-column gap-3">
                  <div className="smallSquare"></div>
                  <div className="smallSquare"></div>
                </div>
                <div className="d-flex flex-column gap-3">
                  <div className="smallSquare"></div>
                  <div className="smallSquare"></div>
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
                <h4>Times Used:</h4>
                <h4>5</h4>
              </div>
              <div className="d-flex flex-row gap-2">
                <h4>Fish Caught:</h4>
                <h4>5</h4>
              </div>
              <div className="d-flex flex-row gap-2">
                <h4>Challenges Completed:</h4>
                <h4>5</h4>
              </div>
              <div className="d-flex flex-row gap-2">
                <h4>Avg. Fish Weight:</h4>
                <h4>2.5 LB</h4>
              </div>
              <div className="d-flex flex-row gap-2">
                <h4>Times Used:</h4>
                <h4>5</h4>
              </div>
            </div>
            <div className="d-flex flex-column gap-1">
              <h4>Strike Rate</h4>
              <ProgressBar now={60} />
            </div>
            <div className="d-flex flex-column gap-1">
              <h4>Morning Catches</h4>
              <ProgressBar now={60} />
            </div>
            <div className="d-flex flex-column gap-1">
              <h4>Day Catches</h4>
              <ProgressBar now={60} />
            </div>
            <div className="d-flex flex-column gap-1">
              <h4>Night Catches</h4>
              <ProgressBar now={60} />
            </div>
            <div className="d-flex flex-column gap-1">
              <h4>Versatility</h4>
              <ProgressBar now={60} />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
