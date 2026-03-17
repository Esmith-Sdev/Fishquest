import "../styles/BottomBar.css";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import FishIcon from "../assets/img/fish-icon.svg?react";
import TackleboxIcon from "../assets/img/Tacklebox.svg?react";
import BookIcon from "../assets/img/Book.svg?react";
import TrophyIcon from "../assets/img/Trophy.svg?react";
import FishermanIcon from "../assets/img/Fisherman.svg?react";
export default function BottomBar() {
  return (
    <Navbar className="bottomNavbar" fixed="bottom">
      <Container>
        <Link to="/home">
          <FishIcon></FishIcon>
        </Link>
        <Link to="/tacklebox">
          <TackleboxIcon></TackleboxIcon>
        </Link>
        <Link to="/logs">
          <BookIcon></BookIcon>
        </Link>
        <Link to="/badges">
          <TrophyIcon></TrophyIcon>
        </Link>
        <Link to="/profile">
          <FishermanIcon></FishermanIcon>
        </Link>
      </Container>
    </Navbar>
  );
}
