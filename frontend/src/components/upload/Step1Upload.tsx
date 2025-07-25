import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { useCallback } from "react";
import Swal from "sweetalert2";

interface Step1UploadProps {
  onNext: () => void;
  setFileData: (data: Record<string, string | number | boolean>[]) => void;
}

const Step1Upload = ({ onNext, setFileData }: Step1UploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const binaryStr = e.target?.result;
        if (!binaryStr) {
          Swal.fire("Error", "No se pudo leer el archivo.", "error");
          return;
        }

        try {
          let workbook;
          if (file.name.endsWith(".csv")) {
            workbook = XLSX.read(binaryStr, { type: "string" });
          } else {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            workbook = XLSX.read(data, { type: "array" });
          }

          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json<
            Record<string, string | number | boolean>
          >(sheet, { defval: "" });

          if (!jsonData || jsonData.length === 0) {
            Swal.fire(
              "Error",
              "El archivo está vacío o no tiene formato válido.",
              "error"
            );
            return;
          }

          setFileData(jsonData);
          onNext();
        } catch (err) {
          console.log(err);
          Swal.fire("Error", "Archivo inválido o corrupto.", "error");
        }
      };

      reader.onerror = () => {
        Swal.fire("Error", "Hubo un problema al leer el archivo.", "error");
      };

      if (file.name.endsWith(".csv")) {
        reader.readAsText(file); // CSV se lee como texto
      } else {
        reader.readAsArrayBuffer(file); // Excel se lee como ArrayBuffer
      }
    },
    [onNext, setFileData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
      "application/vnd.ms-excel": [],
      "text/csv": [],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="border p-5 text-center bg-light rounded"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Suelta el archivo aquí...</p>
      ) : (
        <p>
          Arrastra y suelta tu archivo <strong>Excel o CSV</strong> aquí, o haz
          clic para seleccionar uno.
        </p>
      )}
    </div>
  );
};

export default Step1Upload;
