
import type { DirectionTraffic } from "../types/traffic";
import { optimizeSignalTiming } from "../simulator/signalOptimizer";
import { validateSignalPlan } from "../simulator/signalSafety";

export interface StrategyComparison {
  strategy: "Fixed-time" | "Adaptive";
  totalVehiclesWaiting: number;
  estimatedAverageWaitSeconds: number;
  totalGreenTimeSeconds: number;
  safetyPassed: boolean;
}

export interface DirectionTimingComparison {
  direction: DirectionTraffic["direction"];
  fixedGreenTime: number;
  adaptiveGreenTime: number;
  differenceSeconds: number;
}


function estimateQueueAfterCycle(
  directions: DirectionTraffic[],
  greenTimes: number[],
): number {
  return directions.reduce((total, direction, index) => {
    const demand = direction.vehiclesWaiting;
    const greenTime = greenTimes[index] ?? 0;

    // Illustrative queue-response model, not a traffic prediction.
    const serviceCapacity = greenTime * 0.8;
    const estimatedRemainingQueue = Math.max(
      0,
      demand - serviceCapacity,
    );

    return total + estimatedRemainingQueue;
  }, 0);
}

function estimateAverageWait(
  directions: DirectionTraffic[],
  remainingQueue: number,
): number {
  const originalQueue = directions.reduce(
    (total, direction) => total + direction.vehiclesWaiting,
    0,
  );

  if (originalQueue === 0) return 0;

  const originalWeightedWait = directions.reduce(
    (total, direction) =>
      total + direction.longestWait * direction.vehiclesWaiting,
    0,
  );

  const originalAverageWait = originalWeightedWait / originalQueue;

  // Illustrative adjustment based on the estimated remaining queue.
  const queueRatio = remainingQueue / originalQueue;

  return originalAverageWait * queueRatio;
}


export function compareSignalStrategies(
  directions: DirectionTraffic[],
): StrategyComparison[] {
  const fixedGreenTimes = directions.map(
    (direction) => direction.greenTime,
  );

  const adaptiveDecisions = optimizeSignalTiming(directions);
  const adaptiveGreenTimes = adaptiveDecisions.map(
    (decision) => decision.proposedGreenTime,
  );

  const fixedQueue = estimateQueueAfterCycle(
    directions,
    fixedGreenTimes,
  );

  const adaptiveQueue = estimateQueueAfterCycle(
    directions,
    adaptiveGreenTimes,
  );

  

  const fixedTotalGreen = fixedGreenTimes.reduce(
    (total, seconds) => total + seconds,
    0,
  );

  const adaptiveTotalGreen = adaptiveGreenTimes.reduce(
    (total, seconds) => total + seconds,
    0,
  );

  const safetyReport = validateSignalPlan(adaptiveDecisions);

  return [
    {
      strategy: "Fixed-time",
      totalVehiclesWaiting: Math.round(fixedQueue),
      estimatedAverageWaitSeconds: Number(
        estimateAverageWait(directions, fixedQueue).toFixed(1),
      ),
      totalGreenTimeSeconds: fixedTotalGreen,
      safetyPassed: fixedGreenTimes.every(
        (seconds) => seconds >= 10 && seconds <= 60,
      ),
    },
    {
      strategy: "Adaptive",
      totalVehiclesWaiting: Math.round(adaptiveQueue),
      estimatedAverageWaitSeconds: Number(
        estimateAverageWait(directions, adaptiveQueue).toFixed(1),
      ),
      totalGreenTimeSeconds: adaptiveTotalGreen,
      safetyPassed: safetyReport.passed,
    },
  ];
}


export function compareDirectionTimings(
  directions: DirectionTraffic[],
): DirectionTimingComparison[] {
  const adaptiveDecisions = optimizeSignalTiming(directions);

  return directions.map((direction, index) => {
    const adaptiveGreenTime =
      adaptiveDecisions[index]?.proposedGreenTime ?? direction.greenTime;

    return {
      direction: direction.direction,
      fixedGreenTime: direction.greenTime,
      adaptiveGreenTime,
      differenceSeconds: adaptiveGreenTime - direction.greenTime,
    };
  });
}

