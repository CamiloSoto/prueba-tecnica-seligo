import type { Forecast } from "../types";

const ForecastTable = ({ data }: { data: Forecast[] }) => (
  <div className="mt-4">
    <h4>Pronósticos</h4>
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>SKU</th>
          <th>Fecha</th>
          <th>Base</th>
          <th>Rango</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.sku}</td>
            <td>{new Date(item.forecastDate).toLocaleDateString()}</td>
            <td>{item.baseValue}</td>
            <td>
              {item.lowerBound} - {item.upperBound}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ForecastTable;
