import { useState, useMemo } from "react";
import type { SalesData } from "../types";
import api from "../services/api";

const ITEMS_PER_PAGE = 5;

const SalesTable = ({ data }: { data: SalesData[] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleGenerateForecast = async (sku: string) => {
    await api.post("/forecast/generate", {
      sku,
      horizon: 6,
      confidenceLevel: 0.95,
    });
  };

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, data]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.sku}</td>
              <td>{new Date(sale.date).toLocaleDateString()}</td>
              <td>{sale.quantity}</td>
              <td>${sale.price.toFixed(2)}</td>
              <td>{sale.promotion ? "Sí" : "No"}</td>
              <td>
                <button
                  onClick={() => handleGenerateForecast(sale.sku)}
                  className="btn btn-primary btn-sm"
                >
                  Generar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación Bootstrap */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Anterior
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i + 1}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SalesTable;
