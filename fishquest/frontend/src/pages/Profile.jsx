import { Navbar, Button, Image, ProgressBar, Modal } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../auth";
import BottomBar from "../components/BottomBar";

export default function Profile() {
  const username = localStorage.getItem("user");
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const titles = [
    "Minnow Wrangler",
    "Pond Rookie",
    "Bobber Buddy",
    "Reel Recruit",
    "Hook Apprentice",
    "Line Caster",
    "Bait Specialist",
    "Tackle Technician",
    "Lure Adept",
    "Dock Adventurer",
    "Shoreline Scout",
    "River Ranger",
    "Lake Legend",
    "Deepwater Pro",
    "Tide Tamer",
    "Master Angler",
    "Mythic Fisher",
    "King of the Catch",
    "Reelmaster Supreme",
    "Fish God",
  ];
  const rank = 1;
  const setRankTitle = titles[rank - 1];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <>
      <Navbar className="topNavbar d-flex align-items-center justify-content-between position-relative px-3 py-2">
        <Link to="/">
          <i className="bi bi-arrow-left-circle-fill"></i>
        </Link>

        <h1 className="position-absolute start-50 translate-middle-x fw-bold m-0">
          Profile
        </h1>

        <Button onClick={handleShow} className="orangeButton">
          Settings
        </Button>
      </Navbar>
      <BottomBar />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <Button className="orangeButton" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="flex-column d-flex justify-content-center align-items-center">
        <div className="d-flex flex-row gap-2 p-2 align-items-center">
          <div className="profile-container d-flex flex-row gap-4 w-100">
            <div className="d-flex flex-column align-items-center">
              <h2 className="mb-1">{username}</h2>
              <div className="rigImageContainer">
                <Image></Image>
              </div>
              <Link to="edit-profile">
                <Button className="orangeButton">Customize</Button>
              </Link>
            </div>
            <div className="flex-column d-flex gap-3">
              <h2 className="mb-3 text-center">Stats</h2>
              <div className="d-flex flex-row gap-2">
                <h4>Personal Best:</h4>
                <h4>5.6lb</h4>
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
                <h4>Favorite Bait:</h4>
                <h4>Frog</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 w-100">
          <div className="rank-container d-flex flex-column justify-content-center">
            <h5 className="rank-container-text mb-2">{setRankTitle}</h5>
            <ProgressBar now={60} label="XP" />
            <h5 className="rank-container-text mt-2">Level {rank}</h5>
          </div>
        </div>
      </div>
    </>
  );
}
