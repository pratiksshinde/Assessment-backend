const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  // ← token comes as "Bearer <token>", you must split it
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error });
  }
};

const verifyAdmin     = (req, res, next) => req.user.role === 'admin'     ? next() : res.status(403).json({ message: 'Access denied' });
const verifyInvestor  = (req, res, next) => req.user.role === 'investor'  ? next() : res.status(403).json({ message: 'Access denied' });
const verifyCorporate = (req, res, next) => req.user.role === 'corporate' ? next() : res.status(403).json({ message: 'Access denied' });

module.exports = { verifyToken, verifyAdmin, verifyInvestor, verifyCorporate };