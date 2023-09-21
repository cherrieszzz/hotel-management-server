const jwt= require('jsonwebtoken');
require('dotenv').config();

const isAdminMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if(!token){
        return res.send({
            message:"没有令牌"
        })
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if(decoded.auth !== 'admin' || !decoded.auth) {
        return res.send({
            message: '你不是管理员'
        })
    }
    next();
}

module.exports =isAdminMiddleware;