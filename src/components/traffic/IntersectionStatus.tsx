import type { Intersection } from "../../types/traffic";

interface IntersectionStatusProps {
  intersections: Intersection[];
}

function IntersectionStatus({
  intersections,
}: IntersectionStatusProps) {
  return (
    <section className="intersection-status">
      <div className="section-heading">
        <h3>Intersection status</h3>
        <p>
          Current traffic conditions at monitored
          intersections.
        </p>
      </div>

      <div className="intersection-list">
        {intersections.map((intersection) => (
          <div
            className="intersection-row"
            key={intersection.id}
          >
            <div>
              <strong>{intersection.name}</strong>
              <span>{intersection.id}</span>
            </div>

            <div>
              <span>{intersection.status}</span>
            </div>

            <div>
              <strong>
                {intersection.vehiclesWaiting}
              </strong>
              <span>Vehicles waiting</span>
            </div>

            <div>
              <span>
                {intersection.cameraWorking
                  ? "✓ Working"
                  : "⚠ Problem"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default IntersectionStatus;