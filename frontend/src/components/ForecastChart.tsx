import { useRef } from "react";
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

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import type { Forecast } from "../types";

interface Props {
  data: Forecast[];
}

const ForecastChart = ({ data }: Props) => {
  const sortedData = [...data].sort(
    (a, b) =>
      new Date(a.forecastDate).getTime() - new Date(b.forecastDate).getTime()
  );
  const chartRef = useRef(null);

  const handleDownload = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement("a");
    link.download = "grafico_forecast.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const downloadAsPDF = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 100); // ajuste dimensiones
    pdf.save("grafico_forecast.pdf");
  };

  return (
    <>
      <div ref={chartRef} className="mt-5">
        <h4>Gráfico de Pronóstico</h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="forecastDate"
              tickFormatter={(d) => new Date(d).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip
              formatter={(value: number) => Math.round(value)}
              labelFormatter={(label) =>
                `Fecha: ${new Date(label).toLocaleDateString()}`
              }
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
      <div className="d-flex gap-2 mt-3">
        <button onClick={handleDownload} className="btn btn-outline-success">
          Descargar imagen
        </button>
        <button onClick={downloadAsPDF} className="btn btn-outline-danger">
          Descargar PDF
        </button>
      </div>
    </>
  );
};

export default ForecastChart;
