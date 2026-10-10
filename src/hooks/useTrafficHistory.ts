import { useEffect, useState } from "react";
import type { Intersection } from "../types/traffic";

interface TrafficHistoryPoint {
  time: string;
  vehicles: number;
}

export function useTrafficHistory(
  intersections: Intersection[],
) {
  const [history, setHistory] = useState<TrafficHistoryPoint[]>(
    [],
  );

  const totalVehicles = intersections.reduce(
    (total, intersection) =>
      total + intersection.vehiclesWaiting,
    0,
  );

  useEffect(() => {
    const now = new Date();

    const time = now.toLocaleTimeString("en-CA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    setHistory((previous) => [
      ...previous,
      { time, vehicles: totalVehicles },
    ].slice(-12));
  }, [totalVehicles]);

  return history;
}