import { useState } from "react";
import type { ForecastProps } from "../types";

const ForecastTable = ({ data }: ForecastProps) => {
  const [page, setPage] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);
  const [items, setItems] = useState<number>(5);

  const handleNextPage = async () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = async () => {
    setPage((prev) => prev - 1);
  };

  return (
    <>
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
      <div className="d-flex justify-content-center">
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            {page != 0 ? (
              <li className="page-item">
                <span className="page-link" onClick={handlePrevPage}>
                  Previous
                </span>
              </li>
            ) : null}

            <li className="page-item">
              <span className="page-link">{page + 1}</span>
            </li>
            {page != pages ? (
              <li className="page-item">
                <span className="page-link" onClick={handleNextPage}>
                  Next
                </span>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default ForecastTable;
