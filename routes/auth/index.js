const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const user = await User.findOne({username: username, password: password}).select('-password');
        console.log(user);
        if (!user) {
            return res.send({
                message: "用户名或密码错误"
            })
        }
        if(username === 'admin') {
            console.log("admin comming!")
            const token = jwt.sign({username: username, auth: 'admin'}, process.env.JWT_KEY);
            return res.send({
                token, user
            });
        }
        const token = jwt.sign({username: username, auth: 'user'}, process.env.JWT_KEY);
        return res.send({
            token, user
        });
    } catch (err) {
        console.log(err);
        res.send({message: "Server Error"})
    }
});

router.post('/sign', async (req, res) => {
    try {
        const newUser = req.body;
        console.log(newUser)
        const existingUser = await User.findOne({$or: [{username: newUser.username}, {email: newUser.email}]});
        if (existingUser) {
            return res.send({
                message: "此用户名或邮箱已经注册"
            })
        }
        const createdUser = await User.create(newUser);
        const token = jwt.sign({username: createdUser.username, auth: "user"}, process.env.JWT_KEY);
        res.send({
            message: "成功注册",
            token,
            user: createdUser
        })

    } catch (e) {
        console.log(e);
        res.send({
            message: "server error"
        })
    }
})

module.exports = router;