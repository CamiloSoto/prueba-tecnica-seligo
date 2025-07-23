export interface SalesData {
  id: number;
  sku: string;
  date: string;
  quantity: number;
  price: number;
  promotion: boolean;
  uploadedAt: string;
  fileName: string;
  dataVersion: string;
}

export interface Forecast {
  id: number;
  sku: string;
  forecastDate: string;
  baseValue: number;
  upperBound: number;
  lowerBound: number;
  confidenceLevel: number;
  generatedAt: string;
  modelVersion: string;
}

export interface Configuration {
  confidenceLevel: number;
  forecastHorizon: number;
  alertThresholds: string;
  notificationSettings: string;
}

export interface RawSale {
  sku: string;
  fecha: string;
  cantidad_vendida: number;
  precio: number;
  promocion_activa: boolean;
  categoria: string;
}

export interface AuthState {
  auth: string | boolean;
}

export type AuthAction =
  | { type: "[AUTH] SIGN IN" }
  | { type: "[AUTH] SIGN OUT" };
