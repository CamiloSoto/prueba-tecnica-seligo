import { useState } from "react";

import { useDropzone } from "react-dropzone";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";

import Papa from "papaparse";
import * as XLSX from "xlsx";

import type { RawSale } from "../types";
import api from "../services/api";

type FormValues = {
  file: File | null;
  forecastHorizon: number;
  confidenceLevel: number;
};

const validationSchema = Yup.object().shape({
  file: Yup.mixed<File>()
    .required("Debes seleccionar un archivo")
    .test("fileType", "Solo se permiten CSV o XLSX", (file) =>
      file ? file.name.endsWith(".csv") || file.name.endsWith(".xlsx") : false
    )
    .test("fileSize", "El archivo debe pesar menos de 10MB", (file) =>
      file ? file.size <= 10 * 1024 * 1024 : false
    ),
  forecastHorizon: Yup.number().min(1).max(6).required("Requerido"),
  confidenceLevel: Yup.number().oneOf([0.8, 0.9, 0.95]).required("Requerido"),
});

const SalesUploaderFormik = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const formik = useFormik<FormValues>({
    initialValues: { file: null, forecastHorizon: 6, confidenceLevel: 0.95 },
    validationSchema,
    onSubmit: async (values) => {
      if (!values.file) return;

      const result = await Swal.fire({
        title: "¿Deseas subir este archivo?",
        text: `Archivo: ${values.file.name}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, subir",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) return;

      const formData = new FormData();
      formData.append("file", values.file);

      try {
        setStatus("uploading");
        setMessage("");

        await api.post("/sales/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / (e.total || 1));
            setProgress(percent);
          },
        });

        setStatus("success");
        setMessage("Archivo subido correctamente.");

        await Swal.fire({
          title: "Éxito",
          text: "El archivo fue procesado correctamente.",
          icon: "success",
          timer: 3000,
        });

        let skus: string[] = [];

        if (values.file.name.endsWith(".csv")) {
          const text = await values.file.text();
          const parsed = Papa.parse(text, { header: true });
          const rows = parsed.data as RawSale[];
          skus = [...new Set(rows.map((r) => r.sku))];
        } else if (values.file.name.endsWith(".xlsx")) {
          const arrayBuffer = await values.file.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer);
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(sheet) as RawSale[];
          skus = [...new Set(rows.map((r: RawSale) => r.sku))];
        }

        for (const sku of skus) {
          try {
            await api.post("/forecast/generate", {
              sku,
              horizon: values.forecastHorizon,
              confidenceLevel: values.confidenceLevel,
            });
          } catch (err) {
            console.error(`Error generando forecast para ${sku}`, err);
          }
        }

        await Swal.fire({
          title: "Forecast generado",
          text: `Se generaron pronósticos para ${skus.length} SKU(s).`,
          icon: "success",
        });
      } catch (err) {
        const error = err as AxiosError<{ error: string }>;
        setStatus("error");
        setMessage(
          error?.response?.data?.error || "Error al subir el archivo."
        );

        await Swal.fire({
          title: "Error",
          text: message,
          icon: "error",
        });
      }
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      formik.setFieldValue("file", acceptedFiles[0]);
      setStatus("idle");
      setProgress(0);
      setMessage("");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h4>Cargar Archivo de Ventas</h4>

      <div
        {...getRootProps()}
        className={`dropzone border border-primary border-dashed rounded-3 p-4 text-center ${
          isDragActive ? "bg-light" : "bg-white"
        }`}
        style={{
          cursor: "pointer",
          transition: "background 0.3s",
        }}
      >
        <input {...getInputProps()} />
        {formik.values.file ? (
          <>
            <p className="mb-0">
              Archivo seleccionado: <strong>{formik.values.file?.name}</strong>
            </p>

            <p>
              <strong>Tamaño:</strong>{" "}
              {(formik.values.file!.size / 1024).toFixed(1)} KB
            </p>
          </>
        ) : isDragActive ? (
          <p>Suelta el archivo aquí...</p>
        ) : (
          <p>
            Arrastra y suelta un archivo CSV o XLSX aquí, o haz clic para
            seleccionar.
          </p>
        )}
      </div>

      {formik.touched.file && formik.errors.file && (
        <div className="text-danger mt-2">{formik.errors.file}</div>
      )}

      <div className="form-group">
        <label>Horizonte de pronóstico (meses)</label>
        <select className="form-select" name="forecastHorizon">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        {formik.touched.forecastHorizon && formik.errors.forecastHorizon && (
          <div className="text-danger mt-2">
            {formik.errors.forecastHorizon}
          </div>
        )}
      </div>

      <div className="form-group mt-2">
        <label>Confianza</label>

        <select className="form-select" name="confidenceLevel">
          <option>Open this select menu</option>
          <option value={0.8}>80%</option>
          <option value={0.9}>90%</option>
          <option value={0.95}>95%</option>
        </select>

        {formik.touched.confidenceLevel && formik.errors.confidenceLevel && (
          <div className="text-danger mt-2">
            {formik.errors.confidenceLevel}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary mt-3"
        disabled={status === "uploading"}
      >
        Subir archivo
      </button>

      {status === "uploading" && (
        <div className="progress mt-3">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="alert alert-success mt-3">{message}</div>
      )}

      {status === "error" && (
        <div className="alert alert-danger mt-3">{message}</div>
      )}
    </form>
  );
};

export default SalesUploaderFormik;
