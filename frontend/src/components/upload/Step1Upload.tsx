// src/components/upload/Step1Upload.tsx
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { useCallback } from "react";
import Swal from "sweetalert2";
import type { RawSale } from "../../types";

interface Step1UploadProps {
  onNext: () => void;
  setFileData: (data: RawSale[]) => void;
  setFile: (data: File) => void;
}

function excelDateToISO(serial: number): string {
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400 * 1000;
  const date = new Date(utcValue);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + offset).toISOString().slice(0, 10);
}

function parseDateString(str: string): string | null {
  // ISO (YYYY-MM-DD or YYYY/MM/DD)
  const isoMatch = str.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return `${y}-${m}-${d}`;
  }

  // dd/mm/yyyy
  const dmyMatch = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    return `${y}-${m}-${d}`;
  }

  return null;
}

const Step1Upload = ({ onNext, setFileData, setFile }: Step1UploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const content = e.target?.result;
        if (!content) {
          Swal.fire("Error", "No se pudo leer el archivo.", "error");
          return;
        }

        try {
          const workbook = file.name.endsWith(".csv")
            ? XLSX.read(content as string, { type: "string" })
            : XLSX.read(new Uint8Array(content as ArrayBuffer), {
                type: "array",
              });

          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const raw = XLSX.utils.sheet_to_json<RawSale>(sheet, { defval: "" });

          if (!raw.length) {
            Swal.fire(
              "Error",
              "El archivo está vacío o no tiene formato válido.",
              "error"
            );
            return;
          }

          const transformed: RawSale[] = raw.map((row, idx) => {
            const newRow = { ...row };
            const f = row.fecha;

            if (typeof f === "number") {
              newRow.fecha = excelDateToISO(f);
            } else if (typeof f === "string") {
              const parsed = parseDateString(f.trim());
              if (parsed) {
                newRow.fecha = parsed;
              } else {
                throw new Error(`Fecha inválida en fila ${idx + 2}: ${f}`);
              }
            }

            return newRow;
          });

          setFileData(transformed);
          setFile(file);
          onNext();
        } catch (err: unknown) {
          console.error(err);
          const msg =
            err instanceof Error ? err.message : "Archivo inválido o corrupto.";
          Swal.fire("Error", msg, "error");
        }
      };

      reader.onerror = () => {
        Swal.fire("Error", "Hubo un problema al leer el archivo.", "error");
      };

      if (file.name.endsWith(".csv")) reader.readAsText(file);
      else reader.readAsArrayBuffer(file);
    },
    [onNext, setFileData, setFile]
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
