const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const isUserMiddleware = require('../../middlewares/isUserMiddleware');
const jwt = require("jsonwebtoken");

router.get('/', isUserMiddleware, async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const me = await User.findOne({username: decoded.username})
        if (!me) {
            return res.send({
                message: "查无此人"
            })
        }
        return res.send(me)
    } catch (e) {
        return res.send({
            message: "server error"
        })
    }
})

router.put('/', isUserMiddleware, async (req, res) => {
    try {
        const input = req.body;
        console.log(req.body);
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        console.log(input);
        const me = await User.findOneAndUpdate({username: decoded.username}, input, {new: true});
        console.log(me)
        if (!me) {
            return res.send({
                message: "查无此人"
            })
        }
        return res.send(me)
    } catch (e) {
        console.log(e);
        return res.send({
            message: "server error"
        })
    }
})

// 修改已登陆的密码
router.put('/updatepassword', isUserMiddleware, async (req, res) => {
    try {
        // 从请求中获取当前登录用户的用户名
        const username = req.user.username;

        // 从请求体中获取新密码
        const { newPassword } = req.body;

        // 验证新密码是否符合要求（例如，长度、复杂性等）
        // 这里可以添加密码验证逻辑

        // 使用 bcrypt 加密新密码
        // const hashedPassword = newPassword

        // 更新用户文档中的密码字段
        await User.findOneAndUpdate(
            { username: username },
            { password: newPassword }
        );

        res.status(200).json({ message: '密码已成功更新' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: '更新密码时出错' });
    }
});

module.exports = router;

