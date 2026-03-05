import { Router } from 'express';
import { createListing, getListings } from '../controllers/listingController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/listing', authenticateToken, authorizeRole('restaurant'), createListing);
router.get('/listings', authenticateToken, getListings);

export default router;
