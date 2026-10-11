import type { Intersection } from "../../types/traffic";
import {
  estimateCarbonMetrics,
  compareCarbonMetrics,
} from "../../utils/carbonEstimator";
import { intersections as baselineIntersections } from "../../data/mockData";
import SummaryCard from "../common/SummaryCard";

interface EnvironmentalImpactProps {
  intersections: Intersection[];
}

function EnvironmentalImpact({
  intersections,
}: EnvironmentalImpactProps) {
  const metrics = estimateCarbonMetrics(intersections);
  const comparison = compareCarbonMetrics(
    baselineIntersections,
    intersections,
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

    </section>
  );
}

export default EnvironmentalImpact;
