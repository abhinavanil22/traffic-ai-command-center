import { useEffect, useState } from "react";
import { getActiveAlerts } from "./utils/trafficAlerts";
import IntersectionStatus from "./components/traffic/IntersectionStatus";
import { useTrafficHistory } from "./hooks/useTrafficHistory";
import TrafficChart from "./components/traffic/TrafficChart";
import IntersectionDetails from "./components/traffic/IntersectionDetails";
import SignalDecisionPanel from "./components/traffic/SignalDecisionPanel";


import Header from "./components/layout/Header";
import Navigation, { type DashboardView, } from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import SummaryCard from "./components/common/SummaryCard";

import { intersections as initialIntersections } from "./data/mockData";
import { simulateTraffic } from "./simulator/trafficSimulator";
import type { Intersection } from "./types/traffic";
import type { DemoScenario } from "./types/traffic";


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
  const trafficHistory = useTrafficHistory(intersections);
  const selectedIntersection = intersections[0];
  function handleScenarioChange(scenario: DemoScenario) {
    setActiveScenario(scenario);

    if (scenario === "normal") {
      setIntersections(initialIntersections);
      return;
    }

    setIntersections((currentData) =>
      currentData.map((intersection) => {
        const directions = intersection.directions.map((direction) => ({
          ...direction,
          vehiclesWaiting:
            scenario === "heavy-traffic"
              ? Math.round(direction.vehiclesWaiting * 1.5)
              : direction.vehiclesWaiting,
          averageSpeed:
            scenario === "rain"
              ? Math.max(5, Math.round(direction.averageSpeed * 0.65))
              : direction.averageSpeed,
        }));

        const vehiclesWaiting = directions.reduce(
          (total, direction) => total + direction.vehiclesWaiting,
          0,
        );

        const averageWait = Math.round(
          directions.reduce(
            (total, direction) => total + direction.longestWait,
            0,
          ) / directions.length,
        );

        return {
          ...intersection,
          directions,
          vehiclesWaiting,
          averageWait,
          trafficDensity: Math.min(
            100,
            Math.round((vehiclesWaiting / 250) * 100),
          ),
          cameraWorking:
            scenario === "camera-failure"
              ? false
              : intersection.cameraWorking,
          status:
            scenario === "camera-failure"
              ? "problem"
              : scenario === "heavy-traffic"
                ? "busy"
                : intersection.status,
        };
      }),
    );
  }
  const [activeView, setActiveView] = useState<DashboardView>("Overview");
  const [activeScenario, setActiveScenario] = useState<DemoScenario>("normal");
  const viewDescriptions: Record<
    DashboardView,
    string
  > = {
    Overview: "Live traffic conditions across monitored intersections.",
    Intersections: "Inspect traffic demand and signal timings by direction.",
    "Why Signals Changed": "Review proposed signal timings and their reasoning.",
    "Alerts & Safety": "Monitor intersection status and active alerts.",
    Reports: "Review traffic trends and session statistics.",
    "Manual Control": "Operator controls for the simulated signal environment.",
  };
  

  return (
    <div className="app">
      <Header />

      <Navigation
        activeView={activeView}
        onViewChange={setActiveView}
      />


      <main className="main-content">
        <div className="page-heading">
          <h2>{activeView}</h2>
          <p>{viewDescriptions[activeView]}</p>
        </div>
        {activeView === "Overview" && (
          <section className="demo-controls">
            <div>
              <h3>Demo Scenario Controls</h3>
              <p>Simulate different traffic conditions for the presentation.</p>
            </div>

            <div className="demo-control-buttons">
              <button
                type="button"
                className={activeScenario === "normal" ? "selected" : ""}
                onClick={() => handleScenarioChange("normal")}
              >
                Normal
              </button>

              <button
                type="button"
                className={activeScenario === "heavy-traffic" ? "selected" : ""}
                onClick={() => handleScenarioChange("heavy-traffic")}
              >
                Heavy Traffic
              </button>

              <button
                type="button"
                className={activeScenario === "camera-failure" ? "selected" : ""}
                onClick={() => handleScenarioChange("camera-failure")}
              >
                Camera Failure
              </button>

              <button
                type="button"
                className={activeScenario === "rain" ? "selected" : ""}
                onClick={() => handleScenarioChange("rain")}
              >
                Rain Mode
              </button>
            </div>

            <p className="scenario-status">
              Active scenario: <strong>{activeScenario}</strong>
              {" · "}Simulated data only
            </p>
          </section>
        )}

        {activeView === "Overview" && (
          <>
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

              {selectedIntersection && (
                <IntersectionDetails
                  intersection={selectedIntersection}
                />
              )}

              {selectedIntersection && (
                <SignalDecisionPanel intersection={selectedIntersection} />
              )}

              <TrafficChart data={trafficHistory} />

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
          </>
        )}
        {activeView === "Intersections" && (
          <>
            <IntersectionStatus intersections={intersections} />

            {selectedIntersection && (
              <IntersectionDetails
                intersection={selectedIntersection}
              />
            )}
          </>
        )}

        {activeView === "Why Signals Changed" && (
          selectedIntersection && (
            <SignalDecisionPanel
              intersection={selectedIntersection}
            />
          )
        )}

        {activeView === "Alerts & Safety" && (
          <>
            <div className="summary-grid">
              <SummaryCard
                title="Active alerts"
                value={activeAlerts.length.toString()}
                description="Alerts detected by the simulator"
              />

              <SummaryCard
                title="Camera status"
                value={
                  intersections.every((item) => item.cameraWorking)
                    ? "Operational"
                    : "Attention required"
                }
                description="Status of monitored cameras"
              />
            </div>

            <IntersectionStatus intersections={intersections} />
          </>
        )}

        {activeView === "Reports" && (
          <>
            <div className="summary-grid">
              <SummaryCard
                title="Vehicles waiting"
                value={totalVehiclesWaiting.toString()}
                description="Current simulated traffic count"
              />

              <SummaryCard
                title="Recorded readings"
                value={trafficHistory.length.toString()}
                description="Readings collected this session"
              />
            </div>

            <TrafficChart data={trafficHistory} />

            <p>
              Report data represents this demo session. It is not
              a historical traffic report or a measured improvement.
            </p>
          </>
        )}

        {activeView === "Manual Control" && (
          <section className="intersection-details">
            <div className="section-heading">
              <h3>Operator Control Centre</h3>
              <p>
                Manual signal control is a planned demo feature.
                No commands are sent to physical traffic signals.
              </p>
            </div>

            <p>
              Selected intersection:{" "}
              <strong>
                {selectedIntersection?.name ?? "None selected"}
              </strong>
            </p>

            <p>
              Current mode: <strong>Simulation</strong>
            </p>

            <p>
              Proposed timings can be reviewed in the
              "Why Signals Changed" tab.
            </p>
          </section>
        )}
        
      </main>

      <Footer />
    </div>
  );
}

export default App;