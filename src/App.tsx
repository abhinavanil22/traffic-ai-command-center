import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import SummaryCard from "./components/common/SummaryCard";

function App() {
  return (
    <div className="app">
      <Header />

      <Navigation />

      <main className="main-content">
        <div className="page-heading">
          <h2>Overview</h2>
          <p>
            Live traffic conditions across monitored intersections.
          </p>
        </div>

        <div className="summary-grid">

          <SummaryCard
            title="Vehicles today"
            value="12,847"
            description="Across monitored intersections"
          />

          <SummaryCard
            title="Average waiting time"
            value="34 sec"
            description="Average time vehicles wait"
          />

          <SummaryCard
            title="Signals working"
            value="342 / 344"
            description="2 signals need attention"
          />

          <SummaryCard
            title="Active alerts"
            value="3"
            description="1 urgent • 2 warnings"
          />

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;