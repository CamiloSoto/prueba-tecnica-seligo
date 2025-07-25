import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import type { RawSale } from "../../types";

interface Step2MappingProps {
  data: RawSale[];
  onNext: () => void;
  onBack: () => void;
  setMappedData: (data: RawSale[]) => void;
}

const Step2Mapping = ({
  data,
  onNext,
  setMappedData,
  onBack,
}: Step2MappingProps) => {
  const [preview, setPreview] = useState<RawSale[]>([]);

  useEffect(() => {
    const mapped = data.map(
      (item): RawSale => ({
        sku: String(item["sku"] ?? ""),
        fecha: String(item["fecha"] ?? ""),
        cantidad_vendida: Number(item["cantidad_vendida"] ?? 0),
        precio: Number(item["precio"] ?? 0),
        promocion_activa: (item["promocion_activa"] as boolean) ?? false,
        categoria: String(item["categoria"] ?? ""),
      })
    );

    setPreview(mapped.slice(0, 5));
    setMappedData(mapped);
  }, [data, setMappedData]);

  const handleNext = () => {
    if (preview.length === 0) {
      Swal.fire(
        "Advertencia",
        "No se pudo mapear ningún dato del archivo.",
        "warning"
      );
      return;
    }
    onNext();
  };

  const handleBack = async () => {
    await Swal.fire({
      title: "Pregunta",
      text: "Seguro que quiere volver",
      icon: "question",
      showCancelButton: true
    }).then((res) => {
      if (res.isConfirmed) {
        onBack();
      }
    });
  };

  return (
    <div>
      <h5>Vista previa del mapeo:</h5>
      <div className="table-responsive">
        <table className="table table-bordered table-sm">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Fecha</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Promoción</th>
              <th>Categoría</th>
            </tr>
          </thead>
          <tbody>
            {preview.map((row, i) => (
              <tr key={i}>
                <td>{row.sku}</td>
                <td>{row.fecha}</td>
                <td>{row.cantidad_vendida}</td>
                <td>{row.precio}</td>
                <td>{String(row.promocion_activa)}</td>
                <td>{row.categoria}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-end gap-3">
        <button className="btn btn-danger" onClick={handleBack}>
          Volver
        </button>

        <button className="btn btn-primary" onClick={handleNext}>
          Continuar
        </button>
      </div>
    </div>
  );
};

export default Step2Mapping;
