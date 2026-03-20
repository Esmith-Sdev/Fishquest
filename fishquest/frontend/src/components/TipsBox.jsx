import { Container, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import RigIcon from "../assets/img/Reels/baitcaster.png";
export default function TipsBox() {
  return (
    <Container className="pt-3">
      <Link style={{ textDecoration: "none" }} to="/create-rig">
        <div className="tips-box d-flex flex-row align-items-center p-2">
          <Image src={RigIcon}></Image>
          <div className="d-flex flex-column align-items-center gap-1">
            <div className="d-flex flex-row  gap-1">
              <h3>Tip:</h3>
              <h3>Setup your rig before you go fishing.</h3>
            </div>
          </div>
        </div>
      </Link>
    </Container>
  );
}
