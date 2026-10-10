import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TrafficHistoryPoint {
  time: string;
  vehicles: number;
}

interface TrafficChartProps {
  data: TrafficHistoryPoint[];
}

function TrafficChart({ data }: TrafficChartProps) {
  return (
    <section className="traffic-chart">
      <div className="section-heading">
        <h3>Vehicles waiting over time</h3>
        <p>
          Simulated traffic readings collected during this session.
        </p>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="time" />

            <YAxis
              allowDecimals={false}
              width={45}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="vehicles"
              name="Vehicles waiting"
              stroke="#26374A"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default TrafficChart;