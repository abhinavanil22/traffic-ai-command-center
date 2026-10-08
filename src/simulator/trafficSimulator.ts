import type { Intersection } from "../types/traffic";

function randomChange(value: number, amount: number): number {
  const change = Math.floor(Math.random() * (amount * 2 + 1)) - amount;

  return Math.max(0, value + change);
}

export function simulateTraffic(
  current: Intersection[],
): Intersection[] {
  return current.map((intersection) => {
    const updatedDirections = intersection.directions.map((direction) => ({
      ...direction,
      vehiclesWaiting: randomChange(
        direction.vehiclesWaiting,
        5,
      ),
      averageSpeed: randomChange(
        direction.averageSpeed,
        2,
      ),
      longestWait: randomChange(
        direction.longestWait,
        3,
      ),
    }));

    const vehiclesWaiting = updatedDirections.reduce(
      (total, direction) => total + direction.vehiclesWaiting,
      0,
    );

    const averageWait = Math.round(
      updatedDirections.reduce(
        (total, direction) =>
          total + direction.longestWait,
        0,
      ) / updatedDirections.length,
    );

    const trafficDensity = Math.min(
      100,
      Math.round((vehiclesWaiting / 250) * 100),
    );

    return {
      ...intersection,
      directions: updatedDirections,
      vehiclesWaiting,
      averageWait,
      trafficDensity,
    };
  });
}