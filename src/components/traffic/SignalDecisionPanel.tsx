
import type { Intersection } from "../../types/traffic";
import { optimizeSignalTiming } from "../../simulator/signalOptimizer";
import { validateSignalPlan } from "../../simulator/signalSafety";

interface SignalDecisionPanelProps {
  intersection: Intersection;
}

function SignalDecisionPanel({
  intersection,
}: SignalDecisionPanelProps) {
  const decisions = optimizeSignalTiming(intersection.directions);
  const safetyReport = validateSignalPlan(decisions);

  const totalVehicles = intersection.directions.reduce(
    (total, direction) => total + direction.vehiclesWaiting,
    0,
  );

  return (
    <section className="decision-panel">
      <div className="section-heading">
        <h3>Why Signals Changed</h3>
        <p>
          Simulated recommendations based on current traffic demand.
        </p>
      </div>

      <div className="decision-summary">
        <div>
          <span>Intersection</span>
          <strong>{intersection.name}</strong>
        </div>

        <div>
          <span>Vehicles waiting</span>
          <strong>{totalVehicles}</strong>
        </div>

        <div>
          <span>Basic checks</span>
          <strong>
            {safetyReport.passed ? "Passed" : "Failed"}
          </strong>
        </div>
      </div>

      <div className="decision-list">
        {decisions.map((decision) => {
          const demandShare =
            totalVehicles > 0
              ? Math.round(
                  (decision.vehiclesWaiting / totalVehicles) * 100,
                )
              : 0;

          const change =
            decision.proposedGreenTime - decision.previousGreenTime;

          return (
            <article className="decision-row" key={decision.direction}>
              <div className="decision-title">
                <h4>{decision.direction}</h4>
                <span>{demandShare}% of waiting traffic</span>
              </div>

              <div className="demand-track">
                <div
                  className="demand-fill"
                  style={{ width: `${demandShare}%` }}
                />
              </div>

              <div className="decision-timings">
                <div>
                  <span>Current</span>
                  <strong>{decision.previousGreenTime} sec</strong>
                </div>

                <div>
                  <span>Proposed</span>
                  <strong>{decision.proposedGreenTime} sec</strong>
                </div>

                <div>
                  <span>Change</span>
                  <strong>
                    {change > 0 ? "+" : ""}
                    {change} sec
                  </strong>
                </div>
              </div>

              <p className="decision-reason">{decision.reason}</p>
            </article>
          );
        })}
      </div>

      <p className="simulation-note">
        Demo simulation only. These recommendations are not sent to physical
        traffic signals.
      </p>
    </section>
  );
}

export default SignalDecisionPanel;
