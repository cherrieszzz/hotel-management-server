const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Order = require('../../models/Order');
const Hotel = require('../../models/Hotel');
const jwt = require('jsonwebtoken');
const isUserMiddleware = require('../../middlewares/isUserMiddleware');
const isAdminMiddleware = require('../../middlewares/isAdminMiddleware');


// 查询所有用户的信息
router.get('/', isAdminMiddleware, async (req, res) => {
    console.log("/users");
    try {
        // 查询数据库以获取所有用户的信息
        const users = await User.find();

        // 将用户信息作为 JSON 响应发送给管理员
        res.status(200).json({ users });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: '获取用户列表时出错' });
    }
});

//更新用户信息
router.put('/:username', isAdminMiddleware, async (req, res) => {
    try {
        // 从请求中获取要更新的用户的用户名
        const usernameToUpdate = req.params.username;

        // 从请求体中获取要更新的用户信息
        const updatedUserData = req.body;

        // 检查是否尝试更新用户名和电子邮件字段，如果是，从请求体中删除它们
        if ('username' in updatedUserData) {
            delete updatedUserData.username;
        }
        if ('email' in updatedUserData) {
            delete updatedUserData.email;
        }

        // 检查是否尝试更新用户名为 "admin" 的用户
        if (usernameToUpdate === 'admin') {
            return res.status(403).json({ message: '不允许更新管理员用户信息' });
        }

        // 查询数据库以找到指定用户名的用户
        const userToUpdate = await User.findOne({ username: usernameToUpdate });

        if (!userToUpdate) {
            return res.status(404).json({ message: '用户不存在' });
        }

        // 更新用户信息
        userToUpdate.set(updatedUserData);
        await userToUpdate.save();

        res.status(200).json({ message: '用户信息已成功更新' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: '更新用户信息时出错' });
    }
});


// 注销选定的用户
// 删除用户及相关订单
router.delete('/:username', isAdminMiddleware, async (req, res) => {
    try {
        // 从请求中获取要注销的用户的用户名
        const usernameToDelete = req.params.username;

        // 检查是否尝试删除用户名为 "admin" 的用户
        if (usernameToDelete === 'admin') {
            return res.status(403).json({ message: '不允许删除管理员用户' });
        }

        // 查询数据库以找到指定用户名的用户
        const user = await User.findOne({ username: usernameToDelete });

        if (!user) {
            // 用户不存在，直接返回成功
            return res.status(200).json({ message: '用户不存在' });
        }

        // 查询所有属于该用户的订单
        const userOrders = await Order.find({ username: usernameToDelete });

        // 针对每个订单，将关联的房间状态设置为 "available"，然后删除订单
        for (const order of userOrders) {
            const hotel = await Hotel.findById(order.hotelId);
            if (hotel) {
                const room = hotel.rooms.find(room => room.type === order.roomType);
                if (room) {
                    room.status = 'available';
                    room.orderId = undefined;
                }
                await hotel.save();
            }
            await Order.deleteOne({ _id: order._id });
        }

        // 删除用户
        await User.findOneAndDelete({ username: usernameToDelete });

        res.status(200).json({ message: '用户及相关订单已成功删除' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: '删除用户及相关订单时出错' });
    }
});


module.exports = router;