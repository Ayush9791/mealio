import pool from '../config/db.js';

export const acceptListing = async (req, res) => {
  const { listingId } = req.body;

  if (!listingId) {
    return res.status(400).json({ message: 'listingId is required' });
  }

  try {
    const result = await pool.query(
      `UPDATE food_listings
       SET status = 'accepted', accepted_by = $1
       WHERE id = $2 AND status = 'available'
       RETURNING *`,
      [req.user.id, listingId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Listing not found or already accepted' });
    }

    return res.json({ message: 'Listing accepted', listing: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
