const jwt = require('jsonwebtoken');
const config = require('../config');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) return res.status(401).json({ message: "Authentication token missing" });

    jwt.verify(token, config.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token expired" });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ message: "Invalid token" });
            } else {
                return res.status(500).json({ message: "Failed to authenticate token" });
            }
        }
        req.user = user;
        next();
    });
}
module.exports = authenticateToken;
