const pool = require('../config/database');

// GET /users/:userId/profile
const getProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { rows } = await pool.query(
      `SELECT up.id, up.user_id, up.avatar_url, up.bio, up.rating,
              u.name, u.email
       FROM user_profiles up
       JOIN users u ON u.id = up.user_id
       WHERE up.user_id = $1`,
      [userId]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /users/:userId/profile
const createProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { avatar_url, bio, rating } = req.body;

    // Verify user exists
    const user = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (!user.rows.length) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { rows } = await pool.query(
      `INSERT INTO user_profiles (user_id, avatar_url, bio, rating)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, avatar_url || null, bio || null, rating ?? 0]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'Profile already exists for this user' });
    }
    next(err);
  }
};

// PUT /users/:userId/profile
const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { avatar_url, bio, rating } = req.body;

    const { rows } = await pool.query(
      `UPDATE user_profiles
       SET avatar_url = COALESCE($1, avatar_url),
           bio        = COALESCE($2, bio),
           rating     = COALESCE($3, rating)
       WHERE user_id = $4
       RETURNING *`,
      [avatar_url, bio, rating, userId]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /users/:userId/profile
const deleteProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { rowCount } = await pool.query(
      'DELETE FROM user_profiles WHERE user_id = $1', [userId]
    );
    if (!rowCount) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.json({ success: true, message: 'Profile deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, createProfile, updateProfile, deleteProfile };
