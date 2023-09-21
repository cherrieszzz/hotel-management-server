const jwt = require('jsonwebtoken');
require('dotenv').config();

const isUserMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if(!token){
        return res.send({
            message:"没有令牌"
        })
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if(decoded.auth !== 'user' || !decoded.auth) {
        return res.send({
            message: '你不是普通用户'
        })
    }
    req.user = decoded;
    next();
}

module.exports = isUserMiddleware;