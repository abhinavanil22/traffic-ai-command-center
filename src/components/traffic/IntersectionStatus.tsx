

import type { Intersection } from "../../types/traffic";

interface IntersectionStatusProps {
  intersections: Intersection[];
}

function IntersectionStatus({
  intersections,
}: IntersectionStatusProps) {
  

  function formatStatus(status: Intersection["status"]) {
    switch (status) {
      case "normal":
        return "Normal";
      case "busy":
        return "Busy";
      case "problem":
        return "Problem";
      case "backup":
        return "Backup";
    }
  }

  return (
    <section className="intersection-status">
      <div className="section-heading status-heading">
        <div>
          <h3>Intersection Status</h3>
          <p>Current conditions at monitored intersections.</p>
        </div>

        
        <div className="status-help">
          <span
            className="info-icon"
            role="img"
            aria-label="Status information"
            tabIndex={0}
          >
            ⓘ
          </span>

          <div className="status-help-panel" role="tooltip">
            <h4>Understanding the statuses</h4>

            <p>
              <strong>Normal:</strong> Traffic is within the expected range.
            </p>
            <p>
              <strong>Busy:</strong> Traffic demand is elevated.
            </p>
            <p>
              <strong>Problem:</strong> An issue needs attention.
            </p>
            <p>
              <strong>Backup:</strong> A fallback state is indicated in the simulation.
            </p>

            <hr />

            <p>
              <strong>Camera working:</strong> The camera is marked as available.
            </p>
            <p>
              <strong>Camera unavailable:</strong> The camera is marked as unavailable.
            </p>

            <p className="help-note">
              These statuses describe the demo simulation, not a certified safety assessment.
            </p>
          </div>
        </div>


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
              <span
                className={`intersection-status-label status-${intersection.status}`}
              >
                {formatStatus(intersection.status)}
              </span>
            </div>

            <div>
              <strong>{intersection.vehiclesWaiting}</strong>
              <span>Vehicles waiting</span>
            </div>

            <div>
              <span
                className={
                  intersection.cameraWorking
                    ? "camera-status camera-working"
                    : "camera-status camera-unavailable"
                }
              >
                {intersection.cameraWorking
                  ? "✓ Working"
                  : "⚠ Unavailable"}
              </span>
              <span>Camera health</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default IntersectionStatus;
