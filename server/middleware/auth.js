// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path if necessary

const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization');
 
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided, authorization denied.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ msg: 'User not found, authorization denied.' });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ msg: 'Token is not valid.' });
  }
};


module.exports = auth;
