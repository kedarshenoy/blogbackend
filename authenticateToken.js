const jwt = require('jsonwebtoken');

// Middleware function to check JWT
const authenticateToken = (req, res, next) => {
    // Get the token from the request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Save user info in request for use in other routes
        req.user = user;
        next(); // Proceed to the next middleware/route handler
    });
};

module.exports = authenticateToken;
