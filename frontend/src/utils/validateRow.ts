import moment from "moment";
import type { RawSale } from "../types";

export interface NormalizedRow {
  sku: string;
  fecha?: string;
  cantidad_vendida: number;
  precio: number;
  promocion_activa: boolean;
  categoria: string;
}

export interface ValidationResult {
  row: RawSale;
  errors: string[];
  normalized: Partial<NormalizedRow>;
}

export const validateRow = (row: RawSale): ValidationResult => {
  const errors: string[] = [];
  const normalized: Partial<NormalizedRow> = {};

  // SKU
  const sku = String(row.sku || "").trim();
  if (!/^[A-Za-z0-9]{3,20}$/.test(sku)) {
    errors.push("SKU inválido");
  }
  normalized.sku = sku;

  // Fecha
  const rawDate = row.fecha;
  const parsedDate = moment(
    rawDate,
    [moment.ISO_8601, "DD/MM/YYYY", "MM/DD/YYYY"],
    true
  );
  if (!parsedDate.isValid()) {
    errors.push("Fecha inválida");
  } else {
    normalized.fecha = parsedDate.format("YYYY-MM-DD");
  }

  // Cantidad vendida
  const cantidad = Number(row.cantidad_vendida);
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 100000) {
    errors.push("Cantidad fuera de rango (1-100000)");
  }
  normalized.cantidad_vendida = cantidad;

  // Precio
  const precio = Number(row.precio);
  if (
    isNaN(precio) ||
    precio <= 0 ||
    !/^\d+(\.\d{1,4})?$/.test(String(row.precio))
  ) {
    errors.push("Precio inválido (hasta 4 decimales)");
  }
  normalized.precio = parseFloat(precio.toFixed(4));

  // Promoción activa
  const promo = String(row.promocion_activa).toLowerCase().trim();
  const trueSet = ["1", "true", "sí", "si"];
  const falseSet = ["0", "false", "no"];
  if (trueSet.includes(promo)) {
    normalized.promocion_activa = true;
  } else if (falseSet.includes(promo)) {
    normalized.promocion_activa = false;
  } else {
    errors.push("Promoción inválida");
  }

  // Categoría
  normalized.categoria = String(row.categoria || "").trim();

  return { row, errors, normalized };
};
