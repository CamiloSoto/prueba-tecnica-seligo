const { parse } = require("csv-parse/sync");
const xlsx = require("xlsx");
const z = require("zod");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const salesSchema = z.object({
  sku: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9]+$/),
  fecha: z.string(), 
  cantidad_vendida: z.coerce.number().int().positive().max(100000),
  precio: z.coerce
    .number()
    .positive()
    .refine((val) => val.toFixed(4) === val.toFixed(4)),
  promocion_activa: z.string(),
  categoria: z.string().optional(),
});

function parseBoolean(value) {
  const val = value.toString().toLowerCase().trim();
  return ["true", "1", "sí", "si"].includes(val);
}

function parseDate(str) {
  const parts = str.split(/[/-]/);
  if (parts[0].length === 4) return new Date(str);
  if (parseInt(parts[1]) > 12)
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  return new Date(`${parts[2]}-${parts[0]}-${parts[1]}`); 
}

exports.uploadSalesFile = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const ext = fileName.split(".").pop();

    let records = [];

    if (ext === "csv") {
      const text = fileBuffer.toString("utf-8");
      records = parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    } else {
      const workbook = xlsx.read(fileBuffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      records = xlsx.utils.sheet_to_json(sheet);
    }

    // TODO: extraer de req.user
    const userId = 1; 

    const validated = [];

    for (let row of records) {
      try {
        const result = salesSchema.parse(row);

        validated.push({
          userId,
          sku: result.sku,
          date: parseDate(result.fecha),
          quantity: result.cantidad_vendida,
          price: result.precio,
          promotion: parseBoolean(result.promocion_activa),
          uploadedAt: new Date(),
          fileName: fileName,
          dataVersion: "v1.0",
        });
      } catch (e) {
        return res
          .status(400)
          .json({ error: "Invalid row", details: e.errors, row });
      }
    }

    await prisma.salesData.createMany({ data: validated });

    res.json({
      message: "File uploaded successfully",
      count: validated.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
};
