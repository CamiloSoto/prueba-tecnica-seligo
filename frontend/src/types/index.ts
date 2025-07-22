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
