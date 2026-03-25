const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// @desc   Register new user
// @route  POST /api/auth/register
const register = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) { res.status(400); throw new Error('User already exists'); }
    const user = await User.create({ name, email, password, phone });
    res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
});

// @desc   Login user
// @route  POST /api/auth/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        res.status(401); throw new Error('Invalid email or password');
    }
    res.json({
        success: true,
        token: generateToken(user._id),
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
});

// @desc   Get current user
// @route  GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
});

module.exports = { register, login, getMe };
