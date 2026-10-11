
import type { Intersection } from "../../types/traffic";
import { estimateCarbonMetrics } from "../../utils/carbonEstimator";
import SummaryCard from "../common/SummaryCard";

interface EnvironmentalImpactProps {
  intersections: Intersection[];
}

function EnvironmentalImpact({
  intersections,
}: EnvironmentalImpactProps) {
  const metrics = estimateCarbonMetrics(intersections);

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
    </section>
  );
}

export default EnvironmentalImpact;
