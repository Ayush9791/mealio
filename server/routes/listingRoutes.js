import { Router } from 'express';
import { createListing, getListings, completeListing } from '../controllers/listingController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = Router();

router.post(
  '/listing',
  authenticateToken,
  authorizeRole('restaurant'),
  createListing
);

router.get(
  '/listings',
  authenticateToken,
  getListings
);

router.post(
  '/listing/complete',
  authenticateToken,
  authorizeRole('ngo'),
  completeListing
);

export default router;