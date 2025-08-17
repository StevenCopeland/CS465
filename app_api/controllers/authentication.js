const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');

// Protect routes with Bearer token
function authenticateJWT(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing Bearer token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = payload;
    next();
  });
}

// POST /register
async function register(req, res) {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    // Optional: prevent duplicate registrations
    const existing = await User.findOne({ email }).lean();
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const user = new User({ name, email, password: '' });
    user.setPassword(password);            // provided by your User schema
    await user.save();

    const token = user.generateJWT();      // provided by your User schema
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: String(err) });
  }
}

// POST /login (Passport Local)
function login(req, res) {
  // Validate message to ensure that email and password are present.
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  // Delegate authentication to passport (LocalStrategy)
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      // Error in Authentication Process
      return res.status(500).json({ message: 'Authentication error', error: String(err) });
    }
    if (user) {
      // Auth succeeded - generate JWT and return to caller
      const token = user.generateJWT();
      return res.status(200).json({ token });
    }
    // Auth failed - return strategy info (e.g., { message: 'Invalid credentials' })
    return res.status(401).json(info || { message: 'Unauthorized' });
  })(req, res);
}

module.exports = {
  authenticateJWT,
  register,
  login,
};
