import { useEffect, useState } from "react";

import Select from "react-select";
import type { MultiValue } from "react-select";

import api from "../../services/api";
import type { SalesData, Forecast } from "../../types";

import SalesTable from "../../components/SalesTable";
import ForecastTable from "../../components/ForecastTable";
import ForecastChart from "../../components/ForecastChart";
import Navbar from "./../../components/Navbar";
import { useFormik } from "formik";
import Swal from "sweetalert2";

const DashboardPage = () => {
  const [sales, setSales] = useState<SalesData[]>([]);
  const [salesFiltered, setSalesFiltered] = useState<SalesData[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [dataFiltered, setDataFiltered] = useState<Forecast[]>([]);

  const formik = useFormik({
    initialValues: {
      search: "",
      skus: [] as string[],
      startDate: "",
      endDate: "",
    },
    onSubmit: (data) => {
      let tmp = forecasts;

      if (data.skus.length > 0) {
        tmp = tmp.filter((record) => data.skus.includes(record.sku));
      }

      const skus = tmp.map((record) => record.sku);
      let salesTmp = sales.filter((sale) => skus.includes(sale.sku));

      const start = data.startDate;
      if (start) {
        let end = data.endDate;

        const today = new Date().toISOString().split("T")[0];

        if (start && !end) {
          end = today;
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (start && end && new Date(end) < new Date(start)) {
          Swal.fire({
            title: "La fecha final no puede ser inferior a la inicial",
            icon: "warning",
          });
          return;
        }

        salesTmp = salesTmp.filter((registro) => {
          const recordDate = new Date(registro.date);
          return recordDate >= startDate && recordDate <= endDate;
        });
      }

      setDataFiltered(tmp);
      setSalesFiltered(salesTmp);
    },
  });

  const options = forecasts.map((f) => ({ value: f.sku, label: f.sku }));

  useEffect(() => {
    const fetchData = async () => {
      const [salesRes, forecastRes] = await Promise.all([
        api.get("/sales"),
        api.get("/forecast"),
      ]);

      setSales(salesRes.data);
      setSalesFiltered(salesRes.data);
      setForecasts(forecastRes.data);
      setDataFiltered(forecastRes.data);
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Dashboard</h2>
        <form className="row" onSubmit={formik.handleSubmit}>
          <div className="col">
            <div className="mb-3">
              <label>Selecciona SKU(s):</label>
              <Select<string, true>
                isMulti
                name="skus"
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                value={formik.values.skus.map((sku) => ({
                  value: sku,
                  label: sku,
                }))}
                onChange={(
                  selected: MultiValue<{ value: string; label: string }>
                ) => {
                  formik.setFieldValue(
                    "skus",
                    selected.map((opt) => opt.value)
                  );
                }}
              />
            </div>
          </div>
          <div className="col">
            <div className="mb-3">
              <label>Fecha inicial:</label>
              <input
                type="date"
                name="startDate"
                className="form-control"
                value={formik.values.startDate}
                onChange={formik.handleChange}
              />
            </div>
          </div>
          <div className="col">
            <div className="mb-3">
              <label>Fecha final:</label>
              <input
                type="date"
                name="endDate"
                className="form-control"
                value={formik.values.endDate}
                onChange={formik.handleChange}
              />
            </div>
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary w-100 mt-4">
              filtrar
            </button>
          </div>
        </form>

        <div className="row">
          <div className="col-md-12">
            <ForecastChart data={dataFiltered} />
          </div>
          <div className="col-md-6">
            <SalesTable data={salesFiltered} />
          </div>
          <div className="col-md-6">
            <ForecastTable data={dataFiltered} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
