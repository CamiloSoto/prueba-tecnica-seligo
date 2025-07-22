import type { Configuration } from "../types";

const ConfigForm = ({ initialValues }: { initialValues: Configuration }) => {
  return (
    <div className="mt-4">
      <h4>Configuración del Modelo</h4>
      <ul>
        <li>
          <strong>Confianza:</strong> {initialValues.confidenceLevel * 100}%
        </li>
        <li>
          <strong>Horizonte:</strong> {initialValues.forecastHorizon} días
        </li>
        <li>
          <strong>Alertas:</strong> {initialValues.alertThresholds}
        </li>
        <li>
          <strong>Notificaciones:</strong> {initialValues.notificationSettings}
        </li>
      </ul>
    </div>
  );
};

export default ConfigForm;
