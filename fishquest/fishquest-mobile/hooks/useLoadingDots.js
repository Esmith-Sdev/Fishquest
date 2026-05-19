import { useEffect, useRef, useState } from "react";

export default function useLoadingDots(maxDots = 3, speed = 400) {
  const [dots, setDots] = useState("");
  const count = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      count.current = (count.current + 1) % (maxDots + 1);

      setDots(".".repeat(count.current));
    }, speed);

    return () => clearInterval(interval);
  }, [maxDots, speed]);

  return dots;
}
