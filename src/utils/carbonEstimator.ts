
import type { Intersection } from "../types/traffic";

// Illustrative assumptions for the demo only.
// Replace these with validated, locally appropriate factors
// before using real-world traffic or emissions data.
const IDLE_FUEL_LITRES_PER_HOUR = 0.8;
const CO2_KG_PER_LITRE_PETROL = 2.31;
const CO2_KG_PER_LITRE_DIESEL = 2.68;
const DEMO_PETROL_SHARE = 0.7;

export interface CarbonMetrics {
  estimatedIdleFuelLitresPerHour: number;
  estimatedIdleCO2KgPerHour: number;
  estimatedVehiclesWaiting: number;
  estimatedAverageWaitSeconds: number;
}

export function estimateCarbonMetrics(
  intersections: Intersection[],
): CarbonMetrics {
  const estimatedVehiclesWaiting = intersections.reduce(
    (total, intersection) =>
      total + intersection.vehiclesWaiting,
    0,
  );

  const totalWaitSeconds = intersections.reduce(
    (total, intersection) =>
      total +
      intersection.averageWait * intersection.vehiclesWaiting,
    0,
  );

  const estimatedAverageWaitSeconds =
    estimatedVehiclesWaiting > 0
      ? totalWaitSeconds / estimatedVehiclesWaiting
      : 0;

  // Approximate fuel used by vehicles while idling.
  // This is a scenario estimate, not a measured fuel reading.
  const estimatedIdleFuelLitresPerHour =
    estimatedVehiclesWaiting * IDLE_FUEL_LITRES_PER_HOUR;

  const averageCO2KgPerLitre =
    DEMO_PETROL_SHARE * CO2_KG_PER_LITRE_PETROL +
    (1 - DEMO_PETROL_SHARE) * CO2_KG_PER_LITRE_DIESEL;

  const estimatedIdleCO2KgPerHour =
    estimatedIdleFuelLitresPerHour * averageCO2KgPerLitre;

  return {
    estimatedIdleFuelLitresPerHour:
      Number(estimatedIdleFuelLitresPerHour.toFixed(2)),
    estimatedIdleCO2KgPerHour:
      Number(estimatedIdleCO2KgPerHour.toFixed(2)),
    estimatedVehiclesWaiting,
    estimatedAverageWaitSeconds:
      Number(estimatedAverageWaitSeconds.toFixed(1)),
  };
}


export interface CarbonComparison {
  baselineCO2KgPerHour: number;
  adaptiveCO2KgPerHour: number;
  potentialCO2DifferenceKgPerHour: number;
  potentialReductionPercent: number;
}

export function compareCarbonMetrics(
  baseline: Intersection[],
  adaptive: Intersection[],
): CarbonComparison {
  const baselineMetrics = estimateCarbonMetrics(baseline);
  const adaptiveMetrics = estimateCarbonMetrics(adaptive);

  const potentialCO2DifferenceKgPerHour =
    baselineMetrics.estimatedIdleCO2KgPerHour -
    adaptiveMetrics.estimatedIdleCO2KgPerHour;

  const potentialReductionPercent =
    baselineMetrics.estimatedIdleCO2KgPerHour > 0
      ? (potentialCO2DifferenceKgPerHour /
          baselineMetrics.estimatedIdleCO2KgPerHour) *
        100
      : 0;

  return {
    baselineCO2KgPerHour:
      baselineMetrics.estimatedIdleCO2KgPerHour,
    adaptiveCO2KgPerHour:
      adaptiveMetrics.estimatedIdleCO2KgPerHour,
    potentialCO2DifferenceKgPerHour:
      Number(potentialCO2DifferenceKgPerHour.toFixed(2)),
    potentialReductionPercent:
      Number(potentialReductionPercent.toFixed(1)),
  };
}
