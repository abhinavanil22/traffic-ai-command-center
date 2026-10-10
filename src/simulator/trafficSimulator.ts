
import type { Intersection, DemoScenario } from "../types/traffic";

function randomChange(value: number, amount: number): number {
  const change =
    Math.floor(Math.random() * (amount * 2 + 1)) - amount;

  return Math.max(0, value + change);
}

export function simulateTraffic(
  current: Intersection[],
  scenario: DemoScenario,
  baseline: Intersection[],
): Intersection[] {
  return current.map((intersection, index) => {
    const original = baseline[index] ?? intersection;

    const updatedDirections = intersection.directions.map(
      (direction) => {
        const baseDirection =
          original.directions.find(
            (item) => item.direction === direction.direction,
          ) ?? direction;

        let vehiclesWaiting = randomChange(
          baseDirection.vehiclesWaiting,
          5,
        );

        let averageSpeed = randomChange(
          baseDirection.averageSpeed,
          2,
        );

        let longestWait = randomChange(
          baseDirection.longestWait,
          3,
        );

        if (scenario === "heavy-traffic") {
          vehiclesWaiting = Math.round(vehiclesWaiting * 1.5);
          longestWait = Math.round(longestWait * 1.4);
        }

        if (scenario === "rain") {
          averageSpeed = Math.max(
            5,
            Math.round(averageSpeed * 0.65),
          );
          longestWait = Math.round(longestWait * 1.3);
        }

        if (scenario === "accident") {
          vehiclesWaiting = Math.round(vehiclesWaiting * 1.8);
          averageSpeed = Math.max(
            3,
            Math.round(averageSpeed * 0.4),
          );
          longestWait = Math.round(longestWait * 1.8);
        }

        return {
          ...direction,
          vehiclesWaiting,
          averageSpeed,
          longestWait,
        };
      },
    );

    const vehiclesWaiting = updatedDirections.reduce(
      (total, direction) => total + direction.vehiclesWaiting,
      0,
    );

    const averageWait = Math.round(
      updatedDirections.reduce(
        (total, direction) => total + direction.longestWait,
        0,
      ) / updatedDirections.length,
    );

    const trafficDensity = Math.min(
      100,
      Math.round((vehiclesWaiting / 250) * 100),
    );

    const cameraWorking =
      scenario === "camera-failure"
        ? false
        : original.cameraWorking;

    const status: Intersection["status"] =
      scenario === "camera-failure"
        ? "problem"
        : scenario === "heavy-traffic" ||
            scenario === "accident"
          ? "busy"
          : original.status;

    return {
      ...intersection,
      directions: updatedDirections,
      vehiclesWaiting,
      averageWait,
      trafficDensity,
      cameraWorking,
      status,
    };
  });
}
