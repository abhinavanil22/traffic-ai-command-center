function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-placeholder">
          LOGO
        </div>

        <div>
          <h1>TrafficAI Command Center</h1>
          <p>Adaptive Signal Intelligence System</p>
        </div>
      </div>

      <div className="header-right">
        <span className="live-indicator">
          ● LIVE
        </span>

        <button>
          Français
        </button>
      </div>
    </header>
  );
}

export default Header;