import { Navbar, Button, Card, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import BottomBar from "../components/BottomBar";
import { fetchLogs } from "../api/logs";
import { getToken } from "../api/auth";
import skunkImage from "../assets/img/Fish/skunked.png";
export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLogs() {
      try {
        const token = getToken();
        const data = await fetchLogs(token);
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load logs:", err);
        setError(err.message || "Failed to load logs");
      } finally {
        setLoading(false);
      }
    }

    loadLogs();
  }, []);

  return (
    <>
      <Navbar className="topNavbar d-flex align-items-center justify-content-between position-relative px-3 py-2">
        <Link to="/">
          <i className="bi bi-arrow-left-circle-fill"></i>
        </Link>

        <h1 className="position-absolute start-50 translate-middle-x fw-bold m-0">
          Logs
        </h1>

        <Link to="/create-log">
          <Button className="orangeButton">Create Log</Button>
        </Link>
      </Navbar>

      <BottomBar />

      <div className="d-flex flex-row gap-2 pt-5 align-items-center justify-content-center flex-wrap">
        <h4 className="m-0">Sort By:</h4>
        <Button className="orangeButton">Date</Button>
        <Button className="orangeButton">Photo</Button>
        <Button className="orangeButton">Location</Button>
      </div>

      <Container className="p-3">
        {loading ? (
          <div className="text-center py-5">
            <h4 className="mb-2">Loading logs...</h4>
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <h4 className="mb-2 text-danger">{error}</h4>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="mb-2">No logs yet</h4>
            <p className="mb-3">Create your first log to see it here.</p>
          </div>
        ) : (
          <Row className="g-3">
            {logs.map((log) => {
              const title = log.skunked
                ? "Skunked Trip"
                : log.speciesName || "Unknown Fish";

              const photo = log.skunked
                ? skunkImage
                : log.imageUrls?.[0] || null;
              const formattedDate = log.date
                ? new Date(log.date).toLocaleDateString()
                : "";

              return (
                <Col key={log._id} xs={4} sm={4} md={3} lg={2}>
                  <Card className="text-center h-100">
                    <Card.Body className="pb-2">
                      <Card.Title>{title}</Card.Title>
                    </Card.Body>

                    <Card.Img src={photo || skunkImage} alt={title} />

                    <Card.Body className="pt-2">
                      <Card.Subtitle className="text-muted">
                        {formattedDate}
                      </Card.Subtitle>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </>
  );
}
