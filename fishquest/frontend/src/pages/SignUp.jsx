import { Carousel, Button, Image, Form, Navbar } from "react-bootstrap";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FishQuestLogoOnly from "../assets/img/FishQuest-Logo-only.png";
const API_URL = import.meta.env.DEV
  ? import.meta.env.VITE_LOCAL_API_URL
  : import.meta.env.VITE_API_URL;
const slides = [
  {
    id: 1,
    header: "Welcome To Fish Quest!",
    subHeader: "Lets get to know you better.",
    buttonText: "Get Started",
  },
  { id: 2, type: "form" },
];

function ProfileForm({ form, setForm, onNext }) {
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.toLowerCase().trim(),
          email: form.email.toLowerCase().trim(),
          password: form.password,
        }),
      });
      if (res.ok) {
        alert("Account Created!");
        navigate("/login");
      } else if (res.status === 409) {
        alert("That email is already registered");
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <>
      <Link to="/">
        <i className="bi bi-arrow-left-circle-fill"></i>
      </Link>
      <div className="d-flex justify-content-center pt-3">
        <Image src={FishQuestLogoOnly} className="w-25" />
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            name="username"
            value={form.username}
            onChange={handleChange}
            type="username"
            placeholder="Username"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
          />
        </Form.Group>

        <div className="d-flex justify-content-center pt-3">
          <Button className="orangeButton w-25" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </>
  );
}
export default function SignUp() {
  const [index, setIndex] = useState(0);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  const handleButtonClick = () => {
    const isLastSlide = index === slides.length - 1;
    if (!isLastSlide) setIndex((prev) => prev + 1);
    else console.log("submit", form);
  };
  return (
    <div className="gradient-background">
      <div style={{ marginTop: "50%" }}>
        <Carousel
          activeIndex={index}
          onSelect={setIndex}
          indicators={false}
          controls={false}
          interval={null}
          touch={true}
        >
          {slides.map((slide) => (
            <Carousel.Item className="p-3" key={slide.id}>
              {slide.type === "form" ? (
                <ProfileForm
                  form={form}
                  setForm={setForm}
                  onNext={handleButtonClick}
                />
              ) : (
                <div className="welcomeContainer d-flex flex-column justify-content-center align-items-center gap-3">
                  <Image src={FishQuestLogoOnly} className="w-25" />
                  <h1 className="welcomeHeader">{slide.header}</h1>
                  <h2 className="welcomeSubHeader">{slide.subHeader}</h2>
                  <Button className="orangeButton " onClick={handleButtonClick}>
                    {slide.buttonText}
                  </Button>
                </div>
              )}
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
