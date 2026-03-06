import { Router } from 'express';
import { acceptListing } from '../controllers/pickupController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/accept-listing', authenticateToken, authorizeRole('ngo'), acceptListing);

export default router;
