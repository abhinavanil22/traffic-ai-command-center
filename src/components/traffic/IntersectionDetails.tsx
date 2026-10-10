
import type { Intersection } from "../../types/traffic";

interface IntersectionDetailsProps {
  intersection: Intersection;
}

function IntersectionDetails({
  intersection,
}: IntersectionDetailsProps) {
  return (
    <section className="intersection-details">
      <div className="section-heading">
        <h3>{intersection.name} — Traffic details</h3>
        <p>
          Live simulated traffic conditions by direction.
        </p>
      </div>

      <div className="direction-grid">
        {intersection.directions.map((direction) => (
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
                <span>Green duration</span>
                <strong>{direction.greenTime} sec</strong>
              </div>
            </div>

            <p className="direction-trend">
              Traffic trend: {direction.trend}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default IntersectionDetails;
