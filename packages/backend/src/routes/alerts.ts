import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { requirePlan } from '../middleware/auth';
import { AlertsController } from '../controllers/AlertsController';

const router = express.Router();
const alertsController = new AlertsController();

// GET /api/alerts - Get user's alerts
router.get('/', asyncHandler(alertsController.getAlerts));

// POST /api/alerts - Create new alert
router.post('/', requirePlan('pro'), asyncHandler(alertsController.createAlert));

// GET /api/alerts/:id - Get specific alert
router.get('/:id', asyncHandler(alertsController.getAlert));

// PUT /api/alerts/:id - Update alert
router.put('/:id', asyncHandler(alertsController.updateAlert));

// DELETE /api/alerts/:id - Delete alert
router.delete('/:id', asyncHandler(alertsController.deleteAlert));

// GET /api/alerts/triggers - Get alert triggers
router.get('/triggers', asyncHandler(alertsController.getAlertTriggers));

// POST /api/alerts/:id/test - Test alert
router.post('/:id/test', asyncHandler(alertsController.testAlert));

export default router;