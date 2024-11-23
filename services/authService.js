"use strict";

const bcrypt = require('bcrypt');
const db = require('../models');
const User = db.user;

class AuthService {
    async register(email, password) {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error('User already exists');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await User.create({
                email,
                password: hashedPassword
            });

            return { id: user.id, email: user.email };
        } catch (error) {
            throw error;
        }
    }

    async login(email, password) {
        try {
            // Find user
            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw new Error('User not found');
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid password');
            }

            return { id: user.id, email: user.email };
        } catch (error) {
            throw error;
        }
    }

    async getUserById(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return { id: user.id, email: user.email };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AuthService();
