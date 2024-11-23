const authMiddleware = (req, res, next) => {
    // Check if user is authenticated via session
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};

module.exports = authMiddleware;
