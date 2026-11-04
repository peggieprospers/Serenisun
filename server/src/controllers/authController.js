const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Only send back fields that are safe to show, never the password hash
const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: 'An account with that email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  const passwordMatches = user && (await bcrypt.compare(password, user.passwordHash));

  // Same message for both cases so nobody can guess which emails have accounts
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  res.json({ token: signToken(user), user: publicUser(user) });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  res.json({ user: publicUser(user) });
};