
import { useEffect, useState } from "react";
import type { Intersection } from "../../types/traffic";

export type ControlMode = "Adaptive" | "Fixed-Time" | "Manual";

interface ManualControlProps {
  intersection: Intersection | null;
  mode: ControlMode;
  onModeChange: (mode: ControlMode) => void;
  onApplyPlan: (
    intersectionName: string,
    mode: ControlMode,
    timings: Record<string, number>,
  ) => void;
}

export default function ManualControl({
  intersection,
  mode,
  onModeChange,
  onApplyPlan,
}: ManualControlProps) {
  const [timings, setTimings] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);

  const directions = intersection?.directions ?? [];

  useEffect(() => {
    if (!intersection) {
      setTimings({});
      return;
    }

    setTimings(
      Object.fromEntries(
        intersection.directions.map((direction) => [
          direction.direction,
          direction.greenTime,
        ]),
      ),
    );

    setPendingConfirmation(false);
    setMessage("");
  }, [intersection?.name]);

  const totalGreenTime = directions.reduce(
    (total, direction) =>
      total + (timings[direction.direction] ?? direction.greenTime),
    0,
  );

  const timingsValid =
    directions.length === 4 &&
    directions.every((direction) => {
      const seconds =
        timings[direction.direction] ?? direction.greenTime;
      return Number.isInteger(seconds) && seconds >= 10 && seconds <= 60;
    }) &&
    totalGreenTime === 100;

  function handleModeChange(nextMode: ControlMode) {
    onModeChange(nextMode);
    setPendingConfirmation(false);
    setMessage(`Selected ${nextMode} mode.`);
  }

  function handleApply() {
    if (!intersection) return;

    if (!timingsValid) {
      setMessage(
        "Invalid timing plan. Each direction must have 10–60 seconds, with a total of exactly 100 seconds.",
      );
      setPendingConfirmation(false);
      return;
    }

    if (!pendingConfirmation) {
      setPendingConfirmation(true);
      setMessage("Review the timings, then confirm to apply this simulated plan.");
      return;
    }

    const logEntry =
      `${new Date().toLocaleString()} — ${intersection.name}: ` +
      `${mode} mode; ` +
      directions
        .map(
          (direction) =>
            `${direction.direction} ${timings[direction.direction]}s`,
        )
        .join(", ");

    setActivityLog((previous) => [logEntry, ...previous].slice(0, 10));
    onApplyPlan(intersection.name, mode, timings);
    setMessage("Simulated plan applied in this panel. No physical signals were changed.");
    setPendingConfirmation(false);
  }

  if (!intersection) {
    return (
      <section className="intersection-details">
        <h3>Operator Control Centre</h3>
        <p>Select an intersection before configuring signal timings.</p>
      </section>
    );
  }

  return (
    <section className="intersection-details">
      <div className="section-heading">
        <h3>Operator Control Centre</h3>
        <p>
          Configure and review simulated signal settings. This prototype
          does not control physical traffic lights.
        </p>
      </div>

      <p>
        Selected intersection: <strong>{intersection.name}</strong>
      </p>

      <div className="manual-control-modes">
        <h4>Operating mode</h4>
        <div className="demo-control-buttons">
          {(["Adaptive", "Fixed-Time", "Manual"] as ControlMode[]).map(
            (option) => (
              <button
                key={option}
                type="button"
                className={mode === option ? "selected" : ""}
                onClick={() => handleModeChange(option)}
                aria-pressed={mode === option}
              >
                {option}
              </button>
            ),
          )}
        </div>
        <p>Selected mode: <strong>{mode}</strong></p>
      </div>

      <div className="manual-timing-controls">
        <h4>Proposed green times</h4>
        <p>
          Set each direction to 10–60 seconds. The four green times must
          total exactly 100 seconds.
        </p>

        {directions.map((direction) => (
          <div className="manual-timing-row" key={direction.direction}>
            <label htmlFor={`green-${direction.direction}`}>
              {direction.direction}
            </label>
            <input
              id={`green-${direction.direction}`}
              type="number"
              min={10}
              max={60}
              step={1}
              value={timings[direction.direction] ?? direction.greenTime}
              disabled={mode !== "Manual"}
              onChange={(event) => {
                setTimings((previous) => ({
                  ...previous,
                  [direction.direction]: Number(event.target.value),
                }));
                setPendingConfirmation(false);
                setMessage("");
              }}
            />
            <span>seconds</span>
          </div>
        ))}

        <p>
          Total green time: <strong>{totalGreenTime} / 100 seconds</strong>
        </p>

        <p role="status">
          {mode !== "Manual"
            ? "Timing inputs are enabled only in Manual mode."
            : timingsValid
              ? "Timing plan passes the basic timing checks."
              : "Timing plan is invalid. Check the limits and total."}
        </p>

        <button
          type="button"
          onClick={handleApply}
          disabled={mode !== "Manual"}
        >
          {pendingConfirmation ? "Confirm simulated change" : "Review and apply"}
        </button>

        {pendingConfirmation && (
          <button
            type="button"
            onClick={() => {
              setPendingConfirmation(false);
              setMessage("Confirmation cancelled.");
            }}
          >
            Cancel
          </button>
        )}

        {message && <p role="status">{message}</p>}
      </div>

      <div className="manual-activity-log">
        <h4>Recent operator activity</h4>
        {activityLog.length === 0 ? (
          <p>No simulated changes recorded yet.</p>
        ) : (
          <ul>
            {activityLog.map((entry, index) => (
              <li key={`${entry}-${index}`}>{entry}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
