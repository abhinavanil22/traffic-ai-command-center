import { useEffect, useState } from "react";
import { getActiveAlerts } from "./utils/trafficAlerts";
import IntersectionStatus from "./components/traffic/IntersectionStatus";

import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import SummaryCard from "./components/common/SummaryCard";

import { intersections as initialIntersections } from "./data/mockData";
import { simulateTraffic } from "./simulator/trafficSimulator";
import type { Intersection } from "./types/traffic";

function App() {
  const [intersections, setIntersections] =
    useState<Intersection[]>(initialIntersections);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntersections((currentData) =>
        simulateTraffic(currentData),
      );
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const totalVehiclesWaiting = intersections.reduce(
    (total, intersection) =>
      total + intersection.vehiclesWaiting,
    0,
  );


  const activeAlerts = getActiveAlerts(intersections);

  return (
    <div className="app">
      <Header />

      <Navigation />

      <main className="main-content">
        <div className="page-heading">
          <h2>Overview</h2>
          <p>
            Live traffic conditions across monitored
            intersections.
          </p>
        </div>

        <div className="summary-grid">
          <SummaryCard
            title="Vehicles waiting"
            value={totalVehiclesWaiting.toString()}
            description="Currently waiting across intersections"
          />

          <SummaryCard
            title="Average waiting time"
            value={`${Math.round(
              intersections.reduce(
                (total, intersection) =>
                  total + intersection.averageWait,
                0,
              ) / intersections.length,
            )} sec`}
            description="Average time vehicles wait"
          />

          <SummaryCard
            title="Signals working"
            value={`${intersections.reduce(
              (total, intersection) =>
                total + intersection.signalHealth.working,
              0,
            )} / ${intersections.reduce(
              (total, intersection) =>
                total + intersection.signalHealth.total,
              0,
            )}`}
            description="Signals currently operating"
          />

          <SummaryCard
            title="Active alerts"
            value={activeAlerts.length.toString()}
            description={
              activeAlerts.length === 0
                ? "No active alerts"
                : "Requires attention"
            }
          />
        </div>
        <IntersectionStatus
          intersections={intersections}
        />
        <div className="traffic-info">
          <p>
            Traffic density:{" "}
            {Math.round(
              intersections.reduce(
                (total, intersection) =>
                  total + intersection.trafficDensity,
                0,
              ) / intersections.length,
            )}
            %
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;