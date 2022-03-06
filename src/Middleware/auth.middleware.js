const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'gmailSecret';

const isAuthenticated = (req, res, next) => {
    const authToken = req.headers.authorization;
    if (authToken === undefined) {
        res.status(200).json({
            statusCode: 401,
            message: 'please login again to continue'
        })
        return;
    }
    else {
        jwt.verify(authToken, JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(200).json({
                    statuscode: 401,
                    message: 'session expired'
                })
                return;
            }
            else {
                res.locals.userEmail = decoded.email;
                res.locals.userId = decoded.id;
                res.locals.name = decoded.name;
                next();
            }
        })
    }
}

module.exports = isAuthenticated;