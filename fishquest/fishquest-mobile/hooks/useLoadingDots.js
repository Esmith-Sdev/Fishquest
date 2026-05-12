import { useEffect, useState } from "react";
export default function useLoadingDots(maxDots = 3, speed = 400) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= maxDots ? "" : prev + "."));
    }, speed);

    return () => clearInterval(interval);
  }, [maxDots, speed]);

  return dots;
}
