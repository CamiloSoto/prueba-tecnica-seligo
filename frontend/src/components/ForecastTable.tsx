import { useState, useMemo } from "react";
import type { Forecast } from "../types";

const ITEMS_PER_PAGE = 5;
const MAX_VISIBLE_PAGES = 5;

const ForecastTable = ({ data }: { data: Forecast[] }) => {
  const [currentPage, setCurrentPage] = useState(1);

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

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= MAX_VISIBLE_PAGES) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(MAX_VISIBLE_PAGES / 2);
      let start = Math.max(2, currentPage - half);
      let end = Math.min(totalPages - 1, currentPage + half);

      if (currentPage <= half + 1) {
        end = MAX_VISIBLE_PAGES - 1;
      }

      if (currentPage >= totalPages - half) {
        start = totalPages - (MAX_VISIBLE_PAGES - 2);
      }

      pages.push(1);
      if (start > 2) pages.push("ellipsis-start");

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) pages.push("ellipsis-end");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-4">
      <h4>Pronósticos</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Fecha</th>
            <th>Base</th>
            <th>Rango</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
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

          {getPageNumbers().map((page, index) => {
            if (page === "ellipsis-start" || page === "ellipsis-end") {
              return (
                <li key={index} className="page-item disabled">
                  <span className="page-link">…</span>
                </li>
              );
            }

            return (
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(Number(page))}
                >
                  {page}
                </button>
              </li>
            );
          })}

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

export default ForecastTable;
