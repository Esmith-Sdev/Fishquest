import {
  Navbar,
  Container,
  Col,
  Row,
  ProgressBar,
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Coin from "../assets/img/Coin.png";
export default function Topbar() {
  //Initialize date/time
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  let month = monthNames[currentDate.getMonth()];
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  let setDate = `${month} ${day}, ${year}`;

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const setTime = formatter.format(currentDate);

  //Initialize weather
  const morningIcon = (
    <div className="d-flex justify-content-start flex-column">
      <i className="bi bi-brightness-alt-high-fill text-center"></i>
      <h6>Raining</h6>
    </div>
  );
  const sunnyIcon = (
    <div className="d-flex justify-content-start flex-column">
      <i className="bi bi-brightness-high-fill text-center"></i>
      <h6>Sunny</h6>
    </div>
  );
  const rainyIcon = (
    <div className="d-flex justify-content-start flex-column">
      <i className="bi bi-cloud-drizzle-fill text-center"></i>
      <h6>Raining</h6>
    </div>
  );
  const cloudyIcon = (
    <div className="d-flex justify-content-start flex-column">
      <i className="bi bi-cloudy-fill text-center"></i>
      <h6>Cloudy</h6>
    </div>
  );
  const nightIcon = (
    <div className="d-flex justify-content-start flex-column">
      <i className="bi bi-cloud-moon-fill text-center"></i>
      <h6>Raining</h6>
    </div>
  );

  //Initialize titles
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
  return (
    <Navbar className="topNavbar">
      <Container className="d-block">
        <Row className="align-items-center flex-nowrap px-1">
          {/* LEFT (natural width) */}
          <Col xs="auto" className="me-auto d-flex align-items-center gap-2">
            <div className="d-flex flex-column">
              <h6>{setTime}</h6>
              <h6 className="mb-0">{setDate}</h6>
            </div>
            <div className="d-flex flex-column">{sunnyIcon}</div>
          </Col>

          {/* CENTER (fixed-ish width, truly centered within the row) */}
          <Col xs={6} className="mx-auto text-center">
            <h5 className="mb-2">{setRankTitle}</h5>
            <ProgressBar now={60} label="XP" />
          </Col>

          {/* RIGHT (natural width) */}
          <Col xs="auto" className="ms-auto d-flex align-items-center gap-2">
            <Link to="/shop">
              <Image src={Coin} style={{ width: "2rem", height: "2rem" }} />
            </Link>
            <i className="bi bi-people-fill" style={{ fontSize: "1.5rem" }} />
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}
