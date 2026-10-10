
import type { Intersection } from "../../types/traffic";
import { optimizeSignalTiming } from "../../simulator/signalOptimizer";
import { validateSignalPlan } from "../../simulator/signalSafety";

interface IntersectionDetailsProps {
  intersection: Intersection;
}

function IntersectionDetails({
  intersection,
}: IntersectionDetailsProps) {
  const signalDecisions = optimizeSignalTiming(
    intersection.directions,
  );
  const safetyReport = validateSignalPlan(signalDecisions);

  return (
    <section className="intersection-details">
      <div className="section-heading">
        <h3>{intersection.name} — Traffic details</h3>
        <p>Live simulated traffic conditions by direction.</p>
      </div>
      <div
        className={`safety-panel ${
          safetyReport.passed ? "safety-pass" : "safety-fail"
        }`}
      >
        <h4>
          {safetyReport.passed
            ? "Basic safety checks passed"
            : "Safety checks failed"}
        </h4>

        <p>
          {safetyReport.passed
            ? "The proposed timing plan meets the configured demo constraints."
            : "Do not present this timing plan as validated. Review the failed checks."}
        </p>

        <ul>
          {safetyReport.checks.map((check) => (
            <li key={check.label}>
              <strong>{check.passed ? "PASS" : "FAIL"}</strong>
              {" — "}
              {check.label}: {check.detail}
            </li>
          ))}
        </ul>
      </div>
      <div className="direction-grid">
        {intersection.directions.map((direction) => {
          const decision = signalDecisions.find(
            (item) => item.direction === direction.direction,
          );

          return (
            <article
              className="direction-card"
              key={direction.direction}
            >
              <h4>{direction.direction}</h4>

              <p className="direction-count">
                {direction.vehiclesWaiting}
              </p>
              <p className="direction-label">
                Vehicles waiting
              </p>

              <div className="direction-metrics">
                <div>
                  <span>Average speed</span>
                  <strong>{direction.averageSpeed} km/h</strong>
                </div>

                <div>
                  <span>Longest wait</span>
                  <strong>{direction.longestWait} sec</strong>
                </div>

                <div>
                  <span>Current green</span>
                  <strong>{direction.greenTime} sec</strong>
                </div>

                <div>
                  <span>Proposed green</span>
                  <strong>
                    {decision?.proposedGreenTime ?? direction.greenTime} sec
                  </strong>
                </div>

                <div>
                  <span>Decision reason</span>
                  <strong>
                    {decision?.reason ?? "Current timing retained"}
                  </strong>
                </div>
              </div>

              <p className="direction-trend">
                Traffic trend: {direction.trend}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default IntersectionDetails;
