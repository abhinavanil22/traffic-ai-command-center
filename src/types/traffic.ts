export type IntersectionStatus =
  | "normal"
  | "busy"
  | "problem"
  | "backup";

export type TrafficTrend =
  | "rising"
  | "steady"
  | "falling";

export type Direction =
  | "North"
  | "South"
  | "East"
  | "West";

export interface DirectionTraffic {
  direction: Direction;
  vehiclesWaiting: number;
  averageSpeed: number;
  longestWait: number;
  greenTime: number;
  trend: TrafficTrend;
}

export interface Intersection {
  id: string;
  name: string;
  status: IntersectionStatus;
  vehiclesWaiting: number;
  averageWait: number;
  cameraWorking: boolean;
  trafficDensity: number;
  signalHealth: SignalHealth;
  directions: DirectionTraffic[];
}

export interface SignalHealth {
  total: number;
  working: number;
}