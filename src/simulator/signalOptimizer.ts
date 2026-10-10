
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

function allocateGreenTime(demands: number[]): number[] {
  const count = demands.length;

  if (count === 0) return [];

  const totalCycle = Math.max(
    TOTAL_GREEN_SECONDS,
    count * MIN_GREEN_SECONDS,
  );

  const timings = Array(count).fill(MIN_GREEN_SECONDS);
  let remaining = totalCycle - count * MIN_GREEN_SECONDS;
  const active = demands.map((_, index) => index);

  while (remaining > 0 && active.length > 0) {
    const totalDemand = active.reduce(
      (sum, index) => sum + demands[index],
      0,
    );

    const weights = active.map((index) =>
      totalDemand > 0 ? demands[index] / totalDemand : 1 / active.length,
    );

    let allocated = 0;
    const capped: number[] = [];

    active.forEach((index, position) => {
      const share = remaining * weights[position];
      const capacity = MAX_GREEN_SECONDS - timings[index];
      const addition = Math.min(capacity, Math.floor(share));

      timings[index] += addition;
      allocated += addition;

      if (timings[index] >= MAX_GREEN_SECONDS) {
        capped.push(index);
      }
    });

    remaining -= allocated;

    capped.forEach((index) => {
      const position = active.indexOf(index);
      if (position !== -1) active.splice(position, 1);
    });

    // Distribute leftover seconds one at a time.
    if (remaining > 0 && allocated === 0) {
      const candidates = active.length > 0 ? active : [];
      if (candidates.length === 0) break;

      candidates.sort((a, b) => demands[b] - demands[a]);

      for (const index of candidates) {
        if (remaining === 0) break;

        if (timings[index] < MAX_GREEN_SECONDS) {
          timings[index] += 1;
          remaining -= 1;
        }
      }
    }
  }

  return timings;
}

export function optimizeSignalTiming(
  directions: DirectionTraffic[],
): SignalDecision[] {
  if (directions.length === 0) return [];

  const proposedTimings = allocateGreenTime(
    directions.map((direction) => direction.vehiclesWaiting),
  );

  return directions.map((direction, index) => ({
    direction: direction.direction,
    vehiclesWaiting: direction.vehiclesWaiting,
    previousGreenTime: direction.greenTime,
    proposedGreenTime: proposedTimings[index],
    reason:
      direction.vehiclesWaiting === 0
        ? "Minimum demand; minimum green preferred"
        : `Timing allocated according to ${direction.vehiclesWaiting} waiting vehicles`,
  }));
}
