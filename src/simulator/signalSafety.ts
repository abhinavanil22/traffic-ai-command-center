
import type { SignalDecision } from "./signalOptimizer";

const MIN_GREEN_SECONDS = 10;
const MAX_GREEN_SECONDS = 60;
const EXPECTED_CYCLE_SECONDS = 100;

export interface SafetyCheck {
  label: string;
  passed: boolean;
  detail: string;
}

export interface SignalSafetyReport {
  passed: boolean;
  checks: SafetyCheck[];
}

export function validateSignalPlan(
  decisions: SignalDecision[],
): SignalSafetyReport {
  const totalGreenTime = decisions.reduce(
    (total, decision) => total + decision.proposedGreenTime,
    0,
  );

  const cyclePassed =
    decisions.length > 0 &&
    totalGreenTime === EXPECTED_CYCLE_SECONDS;

  const boundsPassed =
    decisions.length > 0 &&
    decisions.every(
      (decision) =>
        Number.isFinite(decision.proposedGreenTime) &&
        decision.proposedGreenTime >= MIN_GREEN_SECONDS &&
        decision.proposedGreenTime <= MAX_GREEN_SECONDS,
    );

  const valuesPassed =
    decisions.length > 0 &&
    decisions.every(
      (decision) =>
        Number.isFinite(decision.vehiclesWaiting) &&
        decision.vehiclesWaiting >= 0,
    );

  const checks: SafetyCheck[] = [
    {
      label: "Cycle duration",
      passed: cyclePassed,
      detail: `${totalGreenTime} of ${EXPECTED_CYCLE_SECONDS} seconds allocated`,
    },
    {
      label: "Green-time limits",
      passed: boundsPassed,
      detail: "Each direction must receive 10–60 seconds",
    },
    {
      label: "Traffic data",
      passed: valuesPassed,
      detail: "Waiting-vehicle counts must be valid",
    },
  ];

  return {
    passed: checks.every((check) => check.passed),
    checks,
  };
}
