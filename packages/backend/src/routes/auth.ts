import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthController } from '../controllers/AuthController';

const router = express.Router();
const authController = new AuthController();

// POST /api/auth/register - Register a new user
router.post('/register', asyncHandler(authController.register));

// POST /api/auth/login - Login user
router.post('/login', asyncHandler(authController.login));

// POST /api/auth/refresh - Refresh user token
router.post('/refresh', asyncHandler(authController.refresh));

// POST /api/auth/logout - Logout user
router.post('/logout', asyncHandler(authController.logout));

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', asyncHandler(authController.forgotPassword));

// POST /api/auth/reset-password - Reset password
router.post('/reset-password', asyncHandler(authController.resetPassword));

export default router;