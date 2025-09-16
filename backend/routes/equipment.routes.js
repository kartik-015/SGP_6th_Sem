import { Router } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import xlsx from 'xlsx';
import { StoreEquipment, equipmentById, getEquipmentByCategory, listEquipment, updateEquipmentById, deleteEquipmentById } from '../controllers/equipments.controllers.js';
import Equipments from "../models/equipment.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get('/', listEquipment);
router.post('/', StoreEquipment);
router.get('/category/:category', getEquipmentByCategory);
// Flexible lookup: by Mongo _id or barcode (string). Trims input.
router.get('/lookup/:value', asyncHandler(async (req, res) => {
  const raw = (req.params.value ?? '').toString().trim();
  let doc = null;
  if (mongoose.isValidObjectId(raw)) {
    doc = await Equipments.findById(raw);
  }
  if (!doc) {
  const isDigits = /^\d+$/.test(raw);
  const or = [{ barcode: raw }];
  if (isDigits) or.push({ barcode: Number(raw) });
  // case-insensitive exact match as a last resort
  or.push({ barcode: { $regex: `^${raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });
  doc = await Equipments.findOne({ $or: or });
  }
  if (!doc) return res.status(404).json({ statusCode:404, success:false, message:'Not found' });
  return res.status(200).json({ statusCode:200, success:true, data: doc });
}));
// find equipment strictly by barcode (kept for compatibility)
router.get('/barcode/:code', asyncHandler(async (req, res) => {
  const code = (req.params.code ?? '').toString().trim();
  const doc = await Equipments.findOne({ barcode: code });
  if (!doc) return res.status(404).json({ statusCode:404, success:false, message:'Not found' });
  return res.status(200).json({ statusCode:200, success:true, data: doc });
}));

// Excel import: expects single file field named 'file'
const upload = multer();
router.post('/import', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ statusCode:400, success:false, message:'No file' });
  const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);
  const created = [];
  for (const row of rows) {
    const doc = await Equipments.create({
      name: row.itemName || row.name || row.Name,
      sport: (row.sportName || row.sport || row.Sport || '').toLowerCase(),
      category: row.category || row.Category || '',
      barcode: row.barcode || row.Barcode,
      status: row.status || 'available',
      imageUrl: row.imageUrl || '',
      price: Number(row.price || row.Price || 0),
      quantity: Number(row.quantity || row.Quantity || 1),
      available: Number(row.available || row.Available || row.quantity || row.Quantity || 1)
    });
    created.push(doc._id);
  }
  return res.status(201).json({ statusCode:201, success:true, data:{ count: created.length } });
}));

// CRUD by ID should come after specific routes to avoid shadowing them
router.get('/:id', equipmentById);
router.put('/:id', updateEquipmentById);
router.delete('/:id', deleteEquipmentById);

export default router;


