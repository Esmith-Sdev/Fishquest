import { ProgressBar, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";

export default function TimedChallengeModal({ show, onHide, challenge }) {
  const [timeLeft, setTimeLeft] = useState(challenge?.timeLimit ?? 0);
  const [start, setStart] = useState(false);
  useEffect(() => {
    setTimeLeft(challenge?.timeLimit ?? 0);
    setStart(false);
  }, [challenge]);

  useEffect(() => {
    if (!start || !challenge?.timeLimit) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const remaining = Math.max(prev - 1, 0);
        if (remaining <= 0) clearInterval(interval);
        return remaining;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [start, challenge]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  const percent = challenge?.timeLimit
    ? (timeLeft / challenge.timeLimit) * 100
    : 0;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{challenge?.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex align-items-center gap-2">
          <span>{formatTime(timeLeft)}</span>
        </div>

        <ProgressBar now={percent} style={{ height: "1rem", width: "100%" }} />

        <p className="pt-3">
          Once you click "Start" the challenge begins. You have one chance, good
          luck!
        </p>
      </Modal.Body>

      <Modal.Footer className="justify-content-center">
        {!start && (
          <Button
            className="orangeButton"
            onClick={() => {
              setStart(true);
            }}
          >
            Start
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
