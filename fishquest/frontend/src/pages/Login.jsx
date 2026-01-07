import { login } from "../auth";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Image } from "react-bootstrap";
import FishQuestLogoOnly from "../assets/img/FishQuest-Logo-only.png";

export default function Login() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function onSubmit(e) {
    e.preventDefault();

    setError("");
    try {
      await login(username, password);
      navigate("/home");
    } catch (err) {
      setError("Bad username and password");
    }
  }
  return (
    <>
      <div className="gradient-background">
        <div style={{ marginTop: "50%" }}>
          <div className="d-flex justify-content-center">
            <Image src={FishQuestLogoOnly} className="w-25" />
          </div>
          <Form onSubmit={onSubmit} className="p-3">
            <Form.Group className="mb-3">
              <Form.Label htmlFor="username">Username</Form.Label>
              <Form.Control
                id="username"
                value={username}
                onChange={(e) => setU(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                id="password"
                value={password}
                type={password}
                onChange={(e) => setP(e.target.value)}
              />
            </Form.Group>
            <Link className="mt-3" to="/signup">
              Not Registered? Click here to sign up.
            </Link>
            {error && <div id="errorMsg">{error}</div>}
            <div className="d-flex justify-content-center pt-3">
              <Button className="orangeButton w-25" type="submit">
                Login
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
