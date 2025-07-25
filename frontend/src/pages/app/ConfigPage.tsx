import React, { useEffect } from "react";

import { AxiosError } from "axios";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";

import api from "../../services/api";
import Navbar from "../../components/Navbar";

const ConfigPage: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      confidenceLevel: 0.9,
      forecastHorizon: 4,
      alertThresholds: { min: 0, max: 0 },
      notificationSettings: { email: false },
    },
    validationSchema: Yup.object().shape({
      confidenceLevel: Yup.number().oneOf([0.8, 0.9, 0.95]).required(),
      forecastHorizon: Yup.number().min(1).max(6).required(),
      alertThresholds: Yup.object({
        min: Yup.number().min(0).required("Requerido"),
        max: Yup.number().moreThan(Yup.ref("min")).required("Requerido"),
      }),
      notificationSettings: Yup.object({
        email: Yup.boolean(),
      }),
    }),
    onSubmit: async (values) => {
      try {
        await api.put("/config", values);

        await Swal.fire({
          icon: "success",
          title: "Configuración guardada",
          text: "Los cambios se guardaron correctamente.",
        });
      } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        const message = err.response?.data?.error || "Error al guardar";
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: message,
        });
      }
    },
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await api.get("/config");
        console.log(data);
        formik.setValues(data);
      } catch (err) {
        console.error("Error cargando config:", err);
      }
    };
    fetchConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="card mt-4">
          <form onSubmit={formik.handleSubmit} className="card-body">
            <div className="mb-3">
              <label>Confidence Level:</label>
              <select
                name="confidenceLevel"
                className="form-select"
                value={formik.values.confidenceLevel}
                onChange={formik.handleChange}
              >
                <option value={0.8}>0.8</option>
                <option value={0.9}>0.9</option>
                <option value={0.95}>0.95</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Forecast Horizon:</label>
              <input
                type="number"
                name="forecastHorizon"
                className="form-control"
                value={formik.values.forecastHorizon}
                onChange={formik.handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Umbral Mínimo:</label>
              <input
                type="number"
                name="alertThresholds.min"
                className="form-control"
                value={formik.values.alertThresholds?.min ?? ""}
                onChange={formik.handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Umbral Máximo:</label>
              <input
                type="number"
                name="alertThresholds.max"
                className="form-control"
                value={formik.values.alertThresholds?.max ?? ""}
                onChange={formik.handleChange}
              />
            </div>

            <div className="mb-3">
              <input
                type="checkbox"
                name="notificationSettings.email"
                checked={formik.values.notificationSettings?.email ?? ""}
                className="form-check-input"
                onChange={formik.handleChange}
              />
              <label
                className="form-check-label"
                htmlFor="notificationSettings.email"
              >
                Notificaciones por correo
              </label>
            </div>

            <button className="btn btn-primary" type="submit">
              Guardar configuración
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ConfigPage;
