import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { importCounsellors, importTimetable } from "../controllers/import.controllers.js";

const xlsxDir = path.join(process.cwd(), "uploads", "xlsx");
if (!fs.existsSync(xlsxDir)) {
	fs.mkdirSync(xlsxDir, { recursive: true });
}
const upload = multer({ dest: xlsxDir });
const router = Router();

router.post("/counsellors", upload.single("file"), importCounsellors);
router.post("/timetable", upload.single("file"), importTimetable);

export default router;
