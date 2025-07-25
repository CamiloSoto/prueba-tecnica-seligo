import * as Yup from "yup";
import Swal from "sweetalert2";
import type { RawSale } from "../../types";

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
  onBack,
}: {
  mappedData: RawSale[];
  onBack: () => void;
}) => {
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
    } catch (err: unknown) {
      if (err instanceof Yup.ValidationError) {
        Swal.fire({
          title: "Error de validación",
          html: `<pre class="text-start">${err.errors.join("<br>")}</pre>`,
          icon: "error",
        });
      }
    }
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
