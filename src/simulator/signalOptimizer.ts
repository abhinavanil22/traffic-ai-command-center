
import type { DirectionTraffic } from "../types/traffic";

const MIN_GREEN_SECONDS = 10;
const MAX_GREEN_SECONDS = 60;
const TOTAL_GREEN_SECONDS = 100;

export interface SignalDecision {
  direction: DirectionTraffic["direction"];
  vehiclesWaiting: number;
  previousGreenTime: number;
  proposedGreenTime: number;
  reason: string;
}

export function optimizeSignalTiming(
  directions: DirectionTraffic[],
): SignalDecision[] {
  if (directions.length === 0) {
    return [];
  }

  const totalVehicles = directions.reduce(
    (total, direction) =>
      total + direction.vehiclesWaiting,
    0,
  );

  const availableGreenTime =
    Math.max(
      TOTAL_GREEN_SECONDS,
      directions.length * MIN_GREEN_SECONDS,
    );

  return directions.map((direction) => {
    const demandShare =
      totalVehicles > 0
        ? direction.vehiclesWaiting / totalVehicles
        : 1 / directions.length;

    const proposedGreenTime = Math.min(
      MAX_GREEN_SECONDS,
      Math.max(
        MIN_GREEN_SECONDS,
        Math.round(availableGreenTime * demandShare),
      ),
    );

    return {
      direction: direction.direction,
      vehiclesWaiting: direction.vehiclesWaiting,
      previousGreenTime: direction.greenTime,
      proposedGreenTime,
      reason:
        direction.vehiclesWaiting === 0
          ? "Minimum green time maintained"
          : `Timing based on ${direction.vehiclesWaiting} waiting vehicles`,
    };
  });
}
