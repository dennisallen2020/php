import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { requirePlan } from '../middleware/auth';
import { CreativesController } from '../controllers/CreativesController';

const router = express.Router();
const creativesController = new CreativesController();

// GET /api/creatives - Get creatives with filters
router.get('/', asyncHandler(creativesController.getCreatives));

// GET /api/creatives/:id - Get specific creative
router.get('/:id', asyncHandler(creativesController.getCreative));

// GET /api/creatives/search - Search creatives
router.get('/search', asyncHandler(creativesController.searchCreatives));

// POST /api/creatives/favorites - Add creative to favorites
router.post('/favorites', requirePlan('pro'), asyncHandler(creativesController.addToFavorites));

// DELETE /api/creatives/favorites/:id - Remove creative from favorites
router.delete('/favorites/:id', requirePlan('pro'), asyncHandler(creativesController.removeFromFavorites));

// GET /api/creatives/favorites - Get user's favorite creatives
router.get('/favorites', requirePlan('pro'), asyncHandler(creativesController.getFavorites));

// POST /api/creatives/export - Export creatives as CSV/JSON
router.post('/export', requirePlan('pro'), asyncHandler(creativesController.exportCreatives));

export default router;