import { Navbar, Button, Image, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import LeftArrow from "../assets/img/Icons/LeftArrow.png";
import RightArrow from "../assets/img/Icons/RightArrow.png";
export default function RigPreset() {
  return (
    <>
      <Navbar className="topNavbar d-flex align-items-center justify-content-between position-relative px-3 py-2">
        <Link to="/">
          <i className="bi bi-arrow-left-circle-fill"></i>
        </Link>

        <h1 className="position-absolute start-50 translate-middle-x fw-bold m-0">
          My Rig
        </h1>

        <Button className="orangeButton">Save</Button>
      </Navbar>
      <BottomBar />
      <Container className="bottomNavbarSpacing">
        <div className="d-flex flex-column gap-2 p-3 align-items-center">
          <span>Preset 1</span>
          <div className="d-flex flex-row gap-2 align-items-center justify-content-center">
            <Image
              style={{ width: "50px", height: "50px" }}
              src={LeftArrow}
              className="arrow-icon"
            />
            <div className="rigImageContainer"></div>
            <Image
              style={{ width: "50px", height: "50px" }}
              src={RightArrow}
              className="arrow-icon"
            />
          </div>
          <Button className="orangeButton">Customize</Button>
        </div>
        <div className="d-flex flex-column gap-2 p-5 align-items-center">
          <div className="d-flex flex-row gap-3 justify-content-center">
            <div className="d-flex flex-column gap-3">
              <div className="flex-rox d-flex gap-2 align-items-center">
                <Image
                  style={{ width: "20px", height: "20px" }}
                  src={LeftArrow}
                  className="arrow-icon"
                />
                <div className="smallSquare"></div>
                <Image
                  style={{ width: "20px", height: "20px" }}
                  src={RightArrow}
                  className="arrow-icon"
                />
              </div>
              <div className="flex-rox d-flex gap-2 align-items-center">
                <Image
                  style={{ width: "20px", height: "20px" }}
                  src={LeftArrow}
                  className="arrow-icon"
                />
                <div className="smallSquare"></div>
                <Image
                  style={{ width: "20px", height: "20px" }}
                  src={RightArrow}
                  className="arrow-icon"
                />
              </div>
            </div>
            <div className="d-flex flex-column gap-3">
              <div className="flex-rox d-flex gap-2 align-items-center">
                <Image
                  style={{ width: "20px", height: "20px" }}
                  src={LeftArrow}
                  className="arrow-icon"
                />
                <div className="smallSquare"></div>
                <Image
                  style={{ width: "20px", height: "20px" }}
                  src={RightArrow}
                  className="arrow-icon"
                />
              </div>
              <div className="flex-rox d-flex gap-2 align-items-center">
                <Image
                  style={{ width: "20px", height: "20px" }}
                  src={LeftArrow}
                  className="arrow-icon"
                />
                <div className="smallSquare"></div>
                <Image
                  style={{ width: "20px", height: "20px" }}
                  src={RightArrow}
                  className="arrow-icon"
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
