import { Navbar, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import Coin from "../assets/img/Coin.png";
import BottomBar from "../components/BottomBar";
export default function Shop() {
  return (
    <>
      <Navbar className="topNavbar d-flex align-items-center justify-content-between position-relative px-3 py-2">
        <Link to="/">
          <i className="bi bi-arrow-left-circle-fill"></i>
        </Link>

        <h1 className="position-absolute start-50 translate-middle-x fw-bold m-0">
          Shop
        </h1>

        <div className="d-flex flex-row align-items-center justify-content-center">
          <Image src={Coin} style={{ width: "2rem", height: "2rem" }} />
          <h3 className="coinNum">1000</h3>
        </div>
      </Navbar>
      <BottomBar />
    </>
  );
}
