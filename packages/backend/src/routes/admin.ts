import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { requireAdmin } from '../middleware/auth';
import { AdminController } from '../controllers/AdminController';

const router = express.Router();
const adminController = new AdminController();

// Apply admin middleware to all routes
router.use(requireAdmin);

// GET /api/admin/users - Get all users
router.get('/users', asyncHandler(adminController.getUsers));

// GET /api/admin/users/:id - Get specific user
router.get('/users/:id', asyncHandler(adminController.getUser));

// PUT /api/admin/users/:id - Update user
router.put('/users/:id', asyncHandler(adminController.updateUser));

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', asyncHandler(adminController.deleteUser));

// GET /api/admin/scraping-jobs - Get scraping jobs
router.get('/scraping-jobs', asyncHandler(adminController.getScrapingJobs));

// POST /api/admin/scraping-jobs - Create new scraping job
router.post('/scraping-jobs', asyncHandler(adminController.createScrapingJob));

// GET /api/admin/scraping-jobs/:id - Get specific scraping job
router.get('/scraping-jobs/:id', asyncHandler(adminController.getScrapingJob));

// PUT /api/admin/scraping-jobs/:id - Update scraping job
router.put('/scraping-jobs/:id', asyncHandler(adminController.updateScrapingJob));

// DELETE /api/admin/scraping-jobs/:id - Delete scraping job
router.delete('/scraping-jobs/:id', asyncHandler(adminController.deleteScrapingJob));

// GET /api/admin/analytics - Get system analytics
router.get('/analytics', asyncHandler(adminController.getAnalytics));

// POST /api/admin/creatives/manual - Manually add creative
router.post('/creatives/manual', asyncHandler(adminController.addCreativeManually));

// POST /api/admin/ai/test - Test AI analysis
router.post('/ai/test', asyncHandler(adminController.testAIAnalysis));

export default router;