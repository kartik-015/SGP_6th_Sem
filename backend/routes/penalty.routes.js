import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';

const router = Router();

// Placeholder endpoints
router.get('/', asyncHandler(async (req, res) => {
  return res.status(200).json(apiResponse(200, { items: [] }, 'Penalties list'));
}));

router.post('/', asyncHandler(async (req, res) => {
  return res.status(201).json(apiResponse(201, { id: 'penalty-id' }, 'Penalty added'));
}));

router.post('/:id/settle', asyncHandler(async (req, res) => {
  return res.status(200).json(apiResponse(200, {}, 'Penalty settled'));
}));

export default router;


