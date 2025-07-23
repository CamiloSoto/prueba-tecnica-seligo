import { useEffect, useState } from "react";

import api from "../../services/api";
import type { SalesData, Forecast, Configuration } from "../../types";

import SalesTable from "../../components/SalesTable";
import ForecastTable from "../../components/ForecastTable";
import ConfigForm from "../../components/ConfigForm";
import SalesUploaderFormik from "../../components/SalesUploaderFormik";
import ForecastChart from "../../components/ForecastChart";

const DashboardPage = () => {
  const [sales, setSales] = useState<SalesData[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [config, setConfig] = useState<Configuration | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [salesRes, forecastRes, configRes] = await Promise.all([
        api.get("/sales"),
        api.get("/forecast"),
        api.get("/config"),
      ]);

      setSales(salesRes.data);
      setForecasts(forecastRes.data);
      setConfig(configRes.data);
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>

      <div className="row">
        <div className="col-md-5">
          <SalesUploaderFormik />
        </div>
        <div className="col-md-7">
          <ForecastChart data={forecasts} />
        </div>
        <div className="col-md-6">
          <SalesTable data={sales} />
        </div>
        <div className="col-md-6">
          <ForecastTable data={forecasts} />
        </div>
      </div>
      {config && <ConfigForm initialValues={config} />}
    </div>
  );
};

export default DashboardPage;
