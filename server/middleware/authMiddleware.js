import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: token missing' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'mealio_dev_secret');
    req.user = payload;
    next();
  } catch {
    return res.status(403).json({ message: 'Forbidden: invalid token' });
  }
};

export const authorizeRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: role not allowed' });
  }
  next();
};
