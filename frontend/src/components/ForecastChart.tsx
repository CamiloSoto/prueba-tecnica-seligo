import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

import type { Forecast } from "../types";

interface Props {
  data: Forecast[];
}

const ForecastChart = ({ data }: Props) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.forecastDate).getTime() - new Date(b.forecastDate).getTime()
  );

  return (
    <div className="mt-5">
      <h4>Gráfico de Pronóstico</h4>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="forecastDate" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
          <YAxis />
          <Tooltip
            formatter={(value: number) => Math.round(value)}
            labelFormatter={(label) => `Fecha: ${new Date(label).toLocaleDateString()}`}
          />
          {/* Banda de confianza */}
          <Area
            type="monotone"
            dataKey="upperBound"
            stroke="none"
            fill="rgba(0, 123, 255, 0.2)"
            activeDot={false}
          />
          <Area
            type="monotone"
            dataKey="lowerBound"
            stroke="none"
            fill="white"
            activeDot={false}
          />
          {/* Línea base */}
          <Line
            type="monotone"
            dataKey="baseValue"
            stroke="#007bff"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
