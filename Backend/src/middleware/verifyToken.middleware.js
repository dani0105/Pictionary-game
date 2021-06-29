const HttpStatus = require('http-status-codes').StatusCodes;
const jwt = require('jsonwebtoken');
const config = require('../config/config');

//Simple ejemplo de una middleware que verifica que el token sea valido
module.exports = () => {
    return (req, res, next) => {
        if( req.method == 'OPTIONS')
            next();
        else{
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const token = authHeader.split(' ')[1];
                jwt.verify(token, config.server.tokenSecret, (err, user) => {
                    if (err) {
                        return res.sendStatus(HttpStatus.FORBIDDEN);
                    }
                    next();
                });
            } else {
                res.sendStatus(HttpStatus.UNAUTHORIZED);
            }
        }
    }
}

