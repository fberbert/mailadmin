"use client";

import { useEffect, useMemo, useState } from "react";

export function AnimatedNumber({
  value,
  duration = 900,
}: {
  value: number;
  duration?: number;
}) {
  const target = useMemo(() => Math.max(0, Math.trunc(value)), [value]);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const tick = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return <>{display.toLocaleString("en-US")}</>;
}
