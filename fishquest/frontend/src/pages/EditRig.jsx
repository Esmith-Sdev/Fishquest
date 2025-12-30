import { Navbar, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import BottomBar from "../components/BottomBar";
export default function EditRig() {
  return (
    <>
      <Navbar className="topNavbar d-flex align-items-center justify-content-between position-relative px-3 py-2">
        <Link to="/">
          <i className="bi bi-arrow-left-circle-fill"></i>
        </Link>

        <h1 className="position-absolute start-50 translate-middle-x fw-bold m-0">
          Edit Rig
        </h1>

        <Button className="orangeButton">Save</Button>
      </Navbar>
      <BottomBar />
    </>
  );
}
