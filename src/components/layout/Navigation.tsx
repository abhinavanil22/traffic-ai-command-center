function Navigation() {
  const navigationItems = [
    "Overview",
    "Intersections",
    "Why Signals Changed",
    "Alerts & Safety",
    "Reports",
    "Manual Control",
  ];

  return (
    <nav className="navigation">
      {navigationItems.map((item) => (
        <button key={item}>
          {item}
        </button>
      ))}
    </nav>
  );
}

export default Navigation;