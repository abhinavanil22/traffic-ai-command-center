import type { Intersection } from "../types/traffic";

export const intersections: Intersection[] = [
  {
    id: "INT-001",
    name: "North Junction",
    status: "normal",
    vehiclesWaiting: 165,
    averageWait: 34,
    cameraWorking: true,
    trafficDensity: 62,

    directions: [
      {
        direction: "North",
        vehiclesWaiting: 80,
        averageSpeed: 32,
        longestWait: 48,
        greenTime: 50,
        trend: "rising",
      },
      {
        direction: "West",
        vehiclesWaiting: 50,
        averageSpeed: 38,
        longestWait: 35,
        greenTime: 25,
        trend: "steady",
      },
      {
        direction: "East",
        vehiclesWaiting: 20,
        averageSpeed: 45,
        longestWait: 22,
        greenTime: 15,
        trend: "falling",
      },
      {
        direction: "South",
        vehiclesWaiting: 15,
        averageSpeed: 47,
        longestWait: 18,
        greenTime: 10,
        trend: "steady",
      },
    ],
  },
];