import Equipments  from "../models/equipment.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

// store equipment
export const StoreEquipment = asyncHandler(async (req, res) => {
    const { name, sport, category, barcode, status, imageUrl, price, quantity } = req.body;

    if (!name || !sport || !barcode || !status || !price) {
        throw new apiError(400, "Please fill all fields");
    }

    try {
        const newEquipment = await Equipments.create({
            name,
            sport,
            category,
            barcode,
            status,
            imageUrl,
            price,
            quantity: quantity || 1,
            available: quantity || 1
        });

       return res.status(200).json( new apiResponse(200, newEquipment, "Equipment stored successfully"))
    } catch (err) {
        console.error("Error storing equipment:", err);
        throw new apiError(500, "Internal Server Error");
    }
});

export const equipmentById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new apiError(400, "Equipment ID is required");
    }

    try {
        const equipment = await Equipments.findById(id);

        if (!equipment) {
            throw new apiError(404, "Equipment not found");
        }

        return res.status(200).json(new apiResponse(200, equipment, "Equipment retrieved successfully"));
    } catch (err) {
        console.error("Error retrieving equipment:", err);
        throw new apiError(500, "Internal Server Error");
    }
});

export const getEquipmentByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;

    if (!category) {
        throw new apiError(400, "Category is required");
    }

    try {
        const equipments = await Equipments.find({ category });
        if (equipments.length === 0) {
            throw new apiError(404, "No equipments found in this category");
        }
        return res.status(200).json(new apiResponse(200, equipments, "Equipments retrieved successfully"));
    } catch (err) {
        console.error("Error retrieving equipments by category:", err);
        throw new apiError(500, "Internal Server Error");
    }
});

// list equipment with optional category filter
export const listEquipment = asyncHandler(async (req, res) => {
    const { sport, category } = req.query;
    const query = {};
    if (sport) query.sport = sport;
    else if (category) query.sport = category; // backward compat for old clients
    const items = await Equipments.find(query).lean();
    return res.status(200).json(new apiResponse(200, { items }, "Equipments list"));
});

// update
export const updateEquipmentById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updated = await Equipments.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) throw new apiError(404, "Equipment not found");
    return res.status(200).json(new apiResponse(200, updated, "Equipment updated"));
});

// delete
export const deleteEquipmentById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = await Equipments.findByIdAndDelete(id);
    if (!deleted) throw new apiError(404, "Equipment not found");
    return res.status(200).json(new apiResponse(200, {}, "Equipment deleted"));
});

