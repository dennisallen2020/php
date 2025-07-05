import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { DashboardController } from '../controllers/DashboardController';

const router = express.Router();
const dashboardController = new DashboardController();

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', asyncHandler(dashboardController.getStats));

// GET /api/dashboard/trending - Get trending analysis
router.get('/trending', asyncHandler(dashboardController.getTrending));

// GET /api/dashboard/recent - Get recent creatives
router.get('/recent', asyncHandler(dashboardController.getRecentCreatives));

// GET /api/dashboard/insights - Get AI insights
router.get('/insights', asyncHandler(dashboardController.getInsights));

export default router;