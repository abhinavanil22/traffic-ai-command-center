
import type { Intersection } from "../../types/traffic";
import {
  estimateCarbonMetrics,
  compareCarbonMetrics,
} from "../../utils/carbonEstimator";
import { intersections as baselineIntersections } from "../../data/mockData";
import SummaryCard from "../common/SummaryCard";
import {
  compareSignalStrategies,
  compareDirectionTimings,
} from "../../utils/signalComparison";

interface EnvironmentalImpactProps {
  intersections: Intersection[];
}

function EnvironmentalImpact({
  intersections,
}: EnvironmentalImpactProps) {
  const metrics = estimateCarbonMetrics(intersections);

  const directions = intersections.flatMap(
    (intersection) => intersection.directions,
  );

  const signalComparison = compareSignalStrategies(directions);
  const directionTimings = compareDirectionTimings(directions);

  const comparison = compareCarbonMetrics(
    baselineIntersections,
    intersections,
  );

  const fixedTotal = directionTimings.reduce(
    (total, timing) => total + timing.fixedGreenTime,
    0,
  );

  const adaptiveTotal = directionTimings.reduce(
    (total, timing) => total + timing.adaptiveGreenTime,
    0,
  );

  const totalDifference = directionTimings.reduce(
    (total, timing) => total + timing.differenceSeconds,
    0,
  );

  return (
    <section className="environmental-impact">
      <div className="section-heading">
        <div>
          <h3>Environmental Impact</h3>
          <p>
            Estimated vehicle-idling emissions based on simulated
            traffic conditions.
          </p>
        </div>
      </div>

      <div className="summary-grid">
        <SummaryCard
          title="Estimated CO₂ emissions"
          value={`${metrics.estimatedIdleCO2KgPerHour.toFixed(2)} kg/h`}
          description="Modelled idling emissions"
        />

        <SummaryCard
          title="Estimated idling fuel"
          value={`${metrics.estimatedIdleFuelLitresPerHour.toFixed(2)} L/h`}
          description="Illustrative fuel-consumption estimate"
        />

        <SummaryCard
          title="Vehicles waiting"
          value={metrics.estimatedVehiclesWaiting.toString()}
          description="Across monitored intersections"
        />

        <SummaryCard
          title="Average waiting time"
          value={`${metrics.estimatedAverageWaitSeconds.toFixed(1)} sec`}
          description="Vehicle-weighted estimate"
        />
      </div>

      <div className="traffic-info">
        <h3>About these estimates</h3>
        <p>
          These figures are generated from simulated traffic data
          and illustrative fuel-consumption assumptions. They are
          not measured emissions or verified carbon savings.
        </p>
        <p>
          This initial model estimates idling emissions only.
          Moving-vehicle emissions and the effects of adaptive
          signal timing are not included.
        </p>
      </div>

      <div className="traffic-info">
        <h3>Baseline vs Adaptive Signals</h3>
        <p>
          Baseline uses the original mock traffic data. Adaptive
          represents the current simulated traffic snapshot.
        </p>

        <div className="summary-grid">
          <SummaryCard
            title="Baseline estimated CO₂"
            value={`${comparison.baselineCO2KgPerHour.toFixed(2)} kg/h`}
            description="Original mock traffic"
          />

          <SummaryCard
            title="Current estimated CO₂"
            value={`${comparison.adaptiveCO2KgPerHour.toFixed(2)} kg/h`}
            description="Current simulated traffic"
          />

          <SummaryCard
            title="Estimated difference"
            value={`${Math.abs(comparison.potentialCO2DifferenceKgPerHour).toFixed(2)} kg/h`}
            description={
              comparison.potentialCO2DifferenceKgPerHour > 0
                ? "Potential reduction in the model"
                : comparison.potentialCO2DifferenceKgPerHour < 0
                  ? "Estimated emissions increase"
                  : "No estimated difference"
            }
          />

          <SummaryCard
            title="Relative difference"
            value={`${comparison.potentialReductionPercent.toFixed(1)}%`}
            description="Positive means lower estimated emissions"
          />
        </div>
      </div>

      <div className="traffic-info signal-strategy-panel">
        <div className="green-time-heading">
          <div>
            <h3>Fixed-time vs Adaptive Signal Strategy</h3>
            <p>
              Illustrative queue estimates and green-time validation
              using the current simulated traffic snapshot.
            </p>
          </div>

          <span className="simulation-badge">SIMULATED</span>
        </div>

        <div className="signal-strategy-grid">
          {signalComparison.map((result) => (
            <div
              className="signal-strategy-card"
              key={result.strategy}
            >
              <div className="signal-strategy-card-heading">
                <span>{result.strategy}</span>

                <span
                  className={`validation-badge ${
                    result.safetyPassed
                      ? "validation-pass"
                      : "validation-fail"
                  }`}
                >
                  {result.safetyPassed
                    ? "CHECKS PASSED"
                    : "CHECKS FAILED"}
                </span>
              </div>

              <div className="signal-strategy-metric">
                <span>Estimated remaining queue</span>
                <strong>
                  {result.totalVehiclesWaiting} vehicles
                </strong>
              </div>

              <div className="signal-strategy-metric">
                <span>Waiting-time indicator</span>
                <strong>
                  {result.estimatedAverageWaitSeconds.toFixed(1)} sec
                </strong>
              </div>

              <div className="signal-strategy-metric">
                <span>Total green allocation</span>
                <strong>
                  {result.totalGreenTimeSeconds} sec
                </strong>
              </div>
            </div>
          ))}
        </div>

        <p className="green-time-note">
          These are illustrative model outputs, not measured traffic
          performance. The basic validation checks do not certify
          real-world signal safety.
        </p>

        <div className="green-time-table-wrapper">
          <table className="green-time-table">
            <thead>
              <tr>
                <th>Direction</th>
                <th>Fixed-time</th>
                <th>Adaptive</th>
                <th>Change</th>
              </tr>
            </thead>

            <tbody>
              {directionTimings.map((timing) => (
                <tr key={timing.direction}>
                  <td>
                    <span className="direction-label">
                      {timing.direction}
                    </span>
                  </td>

                  <td>{timing.fixedGreenTime} sec</td>

                  <td className="adaptive-value">
                    {timing.adaptiveGreenTime} sec
                  </td>

                  <td>
                    <span
                      className={`timing-change ${
                        timing.differenceSeconds > 0
                          ? "timing-increase"
                          : timing.differenceSeconds < 0
                            ? "timing-decrease"
                            : "timing-unchanged"
                      }`}
                    >
                      {timing.differenceSeconds > 0 ? "+" : ""}
                      {timing.differenceSeconds} sec
                    </span>
                  </td>
                </tr>
              ))}

              <tr className="green-time-total">
                <td>Total cycle allocation</td>
                <td>{fixedTotal} sec</td>
                <td className="adaptive-value">
                  {adaptiveTotal} sec
                </td>
                <td>{totalDifference} sec</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="green-time-note">
          Adaptive timings are proposals generated from simulated
          vehicle demand. The green-time allocation excludes amber
          and all-red intervals.
        </p>
      </div>
    </section>
  );
}

export default EnvironmentalImpact;
