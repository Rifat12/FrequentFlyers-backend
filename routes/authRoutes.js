"use strict";

const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

// Register route
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await authService.register(email, password);
        req.session.userId = user.id;
        res.status(201).json({ message: 'Registration successful', user });
    } catch (error) {
        if (error.message === 'User already exists') {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await authService.login(email, password);
        req.session.userId = user.id;
        res.json({ message: 'Login successful', user });
    } catch (error) {
        if (error.message === 'User not found' || error.message === 'Invalid password') {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.status(500).json({ error: 'Login failed' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Auth check middleware
const authCheck = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

module.exports = { router, authCheck };
