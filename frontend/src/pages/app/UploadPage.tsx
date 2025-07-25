import { useState } from "react";
import Step1Upload from "../../components/upload/Step1Upload";
import Step2Mapping from "../../components/upload/Step2Mapping";
import Step3Confirm from "../../components/upload/Step3Confirm";
import type { RawSale } from "../../types";
import Navbar from "../../components/Navbar";

const steps = ["Subir archivo", "Mapear columnas", "Confirmar"];

const UploadPage = () => {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<RawSale[]>([]);
  const [mappedData, setMappedData] = useState<RawSale[]>([]);

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  return (
    <>
    <Navbar/>
      <div className="container mt-5">
        <h3 className="mb-4">Módulo Avanzado de Carga de Datos</h3>

        <div className="mb-4 d-flex justify-content-between">
          {steps.map((label, i) => (
            <div
              key={label}
              className={`px-3 py-2 border rounded ${
                i === step
                  ? "bg-primary text-white"
                  : i < step
                  ? "bg-success text-white"
                  : "bg-light"
              }`}
            >
              {i + 1}. {label}
            </div>
          ))}
        </div>

        {step === 0 && <Step1Upload onNext={next} setFileData={setFileData} setFile={setFile} />}
        {step === 1 && (
          <Step2Mapping
            data={fileData}
            onNext={next}
            onBack={back}
            setMappedData={setMappedData}
          />
        )}
        {step === 2 && <Step3Confirm mappedData={mappedData} onBack={back} file={file} />}
      </div>
    </>
  );
};

export default UploadPage;
