const jwt = require('jsonwebtoken');
/**
 * @middleware 
 * @description
 * @header {string} req - JSON Web Token for valid user access
 */
const authorize = (req, res, next) => {
    // Get the from request header
    // Authorization: Bearer <token>
    let token = req.header('Authorization');
    if (!token){
        res.status(401).send('Access denied. No token provided!');
    } 
    token = token.split(" ")[1].trim();
    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(499).send('Invalid token');
    }
    // Error Message
}

module.exports = authorize;