import type { SalesData } from "./../types";

const SalesTable = ({ data }: { data: SalesData[] }) => (
  <div className="mt-4">
    <h4>Datos de Ventas</h4>
    <table className="table table-striped">
      <thead>
        <tr>
          <th>SKU</th>
          <th>Fecha</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>Promoción</th>
        </tr>
      </thead>
      <tbody>
        {data.map((sale) => (
          <tr key={sale.id}>
            <td>{sale.sku}</td>
            <td>{new Date(sale.date).toLocaleDateString()}</td>
            <td>{sale.quantity}</td>
            <td>${sale.price.toFixed(2)}</td>
            <td>{sale.promotion ? "Sí" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SalesTable;
