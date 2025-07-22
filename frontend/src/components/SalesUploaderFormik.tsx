import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import api from "../services/api";
import { AxiosError } from "axios";
import Swal from "sweetalert2";

type FormValues = {
  file: File | null;
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
});

const SalesUploaderFormik = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const formik = useFormik<FormValues>({
    initialValues: { file: null },
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
    <form onSubmit={formik.handleSubmit} className="mt-5">
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
