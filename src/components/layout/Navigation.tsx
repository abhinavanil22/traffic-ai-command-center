
export type DashboardView =
  | "Overview"
  | "Intersections"
  | "Why Signals Changed"
  | "Alerts & Safety"
  | "Reports"
  | "Manual Control";

interface NavigationProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

function Navigation({
  activeView,
  onViewChange,
}: NavigationProps) {
  const navigationItems: DashboardView[] = [
    "Overview",
    "Intersections",
    "Why Signals Changed",
    "Alerts & Safety",
    "Reports",
    "Manual Control",
  ];

  return (
    <nav className="navigation" aria-label="Main navigation">
      {navigationItems.map((item) => (
        <button
          key={item}
          type="button"
          className={activeView === item ? "active" : ""}
          aria-current={activeView === item ? "page" : undefined}
          onClick={() => onViewChange(item)}
        >
          {item}
        </button>
      ))}
    </nav>
  );
}

export default Navigation;
