const express = require('express');
const router = express.Router();
const User  = require('../../models/User');
const isUserMiddleware = require('../../middlewares/isUserMiddleware');
const jwt = require("jsonwebtoken");

router.get('/', isUserMiddleware ,async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const me = await User.findOne({username:decoded.username})
        if(!me) {
            return  res.send({
                message:"查无此人"
            })
        }
        return res.send(me)
    } catch (e) {
        return  res.send({
            message:"server error"
        })
    }
})

router.put('/', isUserMiddleware, (req, res) => {

})



module.exports = router;

