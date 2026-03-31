const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate JWT Token
 */
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not defined in environment variables');
    }

    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || '7d'
        }
    );
};


const register = asyncHandler(async (req, res) => {
    if (!req.body) {
        res.status(400);
        throw new Error('Request body is missing. Ensure you are sending JSON data.');
    }
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Name, email and password are required');
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        phone
    });

    if (!user) {
        res.status(400);
        throw new Error('User registration failed');
    }

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token: generateToken(user._id),
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            phone: user.phone
        }
    });
});


/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
    if (!req.body) {
        res.status(400);
        throw new Error('Request body is missing. Ensure you are sending JSON data.');
    }
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    res.status(200).json({
        success: true,
        message: 'Login successful',
        token: generateToken(user._id),
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            phone: user.phone
        }
    });
});


/**
 * @desc    Get logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({
        success: true,
        user
    });
});


/**
 * @desc    Admin Register (API Only)
 * @route   POST /api/auth/admin/register
 * @access  Public
 */
const adminRegister = asyncHandler(async (req, res) => {
    // Safety check for missing request body
    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400);
        throw new Error('Request body is missing. Ensure you are sending JSON data in the Body tab (select raw and JSON).');
    }

    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        const missing = [];
        if (!name) missing.push('name');
        if (!email) missing.push('email');
        if (!password) missing.push('password');
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
        role: 'admin'
    });

    if (user) {
        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } else {
        res.status(400);
        throw new Error('Invalid admin data');
    }
});


module.exports = {
    register,
    login,
    getMe,
    adminRegister
};