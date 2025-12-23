import { Navbar, Button, Card, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import logPhoto from "../assets/img/logPhoto.jpg";
import logPhoto2 from "../assets/img/logPhoto2.jpg";
export default function Logs() {
  const logs = [];

  const isFilled = (log) => {
    return (
      Boolean(log?.title?.trim()) &&
      Boolean(log?.date?.trim()) &&
      Boolean(log?.photo)
    );
  };
  const filledLogs = logs.filter(isFilled);
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
        {filledLogs.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="mb-2">No logs yet</h4>
            <p className="mb-3">Create your first log to see it here.</p>
          </div>
        ) : (
          <Row className="g-3">
            {filledLogs.map((log) => (
              <Col className="" key={log.id} xs={6} sm={6} md={4} lg={3}>
                <Card className="text-center h-100">
                  <Card.Body className="pb-2">
                    <Card.Title className="mb-2">{log.title}</Card.Title>
                  </Card.Body>

                  <Card.Img
                    src={log.photo}
                    alt={log.title}
                    style={{
                      objectFit: "cover",
                      height: "160px",
                    }}
                  />

                  <Card.Body className="pt-2">
                    <Card.Subtitle className="text-muted">
                      {log.date}
                      {log.location ? ` • ${log.location}` : ""}
                    </Card.Subtitle>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}
