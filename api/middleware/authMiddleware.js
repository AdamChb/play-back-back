const jwt = require('jsonwebtoken');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        console.error("No token provided");
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Token verification failed:", err.message);
            return res.sendStatus(403); // Forbidden
        }
        if (!user || !user.id) {
            console.error("Invalid token payload:", user);
            console.error("Invalid user data in token");
            return res.sendStatus(401); // Unauthorized
        }
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken
};
