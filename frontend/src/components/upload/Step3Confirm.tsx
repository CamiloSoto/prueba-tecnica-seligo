import { useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";

import { useNavigate } from "react-router-dom";

import type { RawSale } from "../../types";
import api from "../../services/api";

const validationSchema = Yup.object().shape({
  sku: Yup.string()
    .matches(/^[A-Za-z0-9]{3,20}$/, "SKU inválido")
    .required(),
  fecha: Yup.date().typeError("Fecha inválida").required(),
  cantidad_vendida: Yup.number().integer().min(1).max(100000).required(),
  precio: Yup.number()
    .positive()
    .max(9999999)
    .test(
      "decimales",
      "Máximo 4 decimales",
      (val) => (val?.toString().split(".")[1]?.length || 0) <= 4
    )
    .required(),
  promocion_activa: Yup.mixed()
    .test("boolean", "Valor booleano inválido", (val) =>
      ["true", "false", "sí", "no", "0", "1"].includes(
        String(val).toLowerCase()
      )
    )
    .required(),
  categoria: Yup.string().required(),
});

const Step3Confirm = ({
  mappedData,
  file,
  onBack,
}: {
  mappedData: RawSale[];
  file: File | null;
  onBack: () => void;
}) => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const naviate = useNavigate();
  const handleSubmit = async () => {
    try {
      for (const row of mappedData) {
        await validationSchema.validate(row, { abortEarly: false });
      }

      Swal.fire(
        "¡Éxito!",
        "Todos los datos son válidos. Procesando carga...",
        "success"
      );

      const formData = new FormData();
      if (!file) {
        await Swal.fire({
          title: "Archivo",
          text: `Se presento unproblema con el archivo, intenta de nuevo`,
          icon: "error",
        });
        return;
      }
      formData.append("file", file);
      setIsUploading(true);
      try {
        await api.post("/sales/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / (e.total || 1));
            setProgress(Math.round(percent / 2));
          },
        });

        await Swal.fire({
          title: "Éxito",
          text: "El archivo fue procesado correctamente.",
          icon: "success",
          timer: 3000,
        });

        const skus: string[] = mappedData.map((r) => r.sku);
        let count = 0;

        for (const sku of skus) {
          try {
            await api.post("/forecast/generate", {
              sku,
              horizon: 6,
              confidenceLevel: 0.95,
            });
          } catch (err) {
            console.error(`Error generando forecast para ${sku}`, err);
          } finally {
            count += 1;
          }
          const percent = Math.round((count * 100) / (sku.length || 1));
          setProgress(Math.round(percent / 2) + 50);
        }

        await Swal.fire({
          title: "Forecast generado",
          text: `Se generaron pronósticos para ${skus.length} SKU(s).`,
          icon: "success",
        });
        setIsUploading(false);
      } catch (err) {
        console.log("error", err);
        setIsUploading(false);
      }
    } catch (err: unknown) {
      if (err instanceof Yup.ValidationError) {
        Swal.fire({
          title: "Error de validación",
          html: `<pre class="text-start">${err.errors.join("<br>")}</pre>`,
          icon: "error",
        });
      }
    }
    await Swal.fire({
      title: "Ir al Dashboard!",
      icon: "success",
    }).then((res) => {
      if (res.isConfirmed) {
        naviate("/dashboard");
      }
    });
  };

  const handleBack = async () => {
    await Swal.fire({
      title: "Pregunta",
      text: "Seguro que quiere volver",
      icon: "question",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        onBack();
      }
    });
  };

  return (
    <div>
      <h5>Confirmación</h5>
      <p>Se validarán {mappedData.length} registros.</p>

      {isUploading && (
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

      <div className="d-flex justify-content-end gap-3">
        <button className="btn btn-danger" onClick={handleBack}>
          Volver
        </button>

        <button className="btn btn-success" onClick={handleSubmit}>
          Validar y Confirmar
        </button>
      </div>
    </div>
  );
};

export default Step3Confirm;
