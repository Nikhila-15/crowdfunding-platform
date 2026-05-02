import express from 'express';
import { createOrder, verifyPayment, getMyContributions } from '../controllers/contributionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/mycontributions', protect, getMyContributions);

export default router;
