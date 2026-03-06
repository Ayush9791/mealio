import pool from '../config/db.js';

export const createListing = async (req, res) => {
  const { title, description, quantity_portions, expiry_time, latitude, longitude } = req.body;

  if (!title || !description || !quantity_portions || !expiry_time || latitude == null || longitude == null) {
    return res.status(400).json({ message: 'All listing fields are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO food_listings
      (restaurant_id, title, description, quantity_portions, expiry_time, latitude, longitude, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'available')
      RETURNING *`,
      [req.user.id, title, description, quantity_portions, expiry_time, latitude, longitude],
    );

    return res.status(201).json({
      message: 'Listing created',
      listing: result.rows[0]
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const getListings = async (_req, res) => {
  try {

    const result = await pool.query(
      `SELECT
        id,
        restaurant_id,
        title,
        description,
        quantity_portions,
        expiry_time,
        latitude,
        longitude,
        status,
        accepted_by
      FROM food_listings
      ORDER BY created_at DESC`
    );

    return res.json({
      listings: result.rows
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const completeListing = async (req, res) => {

  const { listingId } = req.body;

  if (!listingId) {
    return res.status(400).json({
      message: 'listingId required'
    });
  }

  try {

    const result = await pool.query(
      `UPDATE food_listings
       SET status = 'completed',
           updated_at = NOW()
       WHERE id = $1
       AND accepted_by = $2
       RETURNING *`,
      [listingId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Listing not found or not accepted by this NGO'
      });
    }

    return res.json({
      message: 'Listing marked as completed',
      listing: result.rows[0]
    });

  } catch (error) {

    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });

  }

};