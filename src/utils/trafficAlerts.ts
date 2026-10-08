import type { Intersection } from "../types/traffic";

export function getActiveAlerts(
  intersections: Intersection[],
): string[] {
  const alerts: string[] = [];

  intersections.forEach((intersection) => {
    if (!intersection.cameraWorking) {
      alerts.push(
        `${intersection.name}: Camera problem`,
      );
    }

    if (intersection.trafficDensity >= 80) {
      alerts.push(
        `${intersection.name}: Heavy traffic`,
      );
    }

    if (intersection.status === "backup") {
      alerts.push(
        `${intersection.name}: Backup timing plan active`,
      );
    }
  });

  return alerts;
}