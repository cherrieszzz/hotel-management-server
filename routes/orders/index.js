const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Order = require('../../models/Order');
const Hotel = require('../../models/Hotel');
const jwt = require('jsonwebtoken');
const isUserMiddleware = require('../../middlewares/isUserMiddleware');
const isAdminMiddleware = require('../../middlewares/isAdminMiddleware');

// 获取已登陆用户得所有订单
router.get('/', isUserMiddleware, async (req, res) => {
    try {
        // 从请求中获取已登录用户的信息，例如用户名或用户ID
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // 使用用户信息查询数据库以检索与该用户相关的所有订单
        const orders = await Order.find({ username: decoded.username });

        // 将查询结果作为 JSON 响应发送给客户端
        res.status(200).json({ orders });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: '获取订单时出错' });
    }
})

// 创建一个订单
router.post('/:hotelId/', isUserMiddleware, async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const { roomType } = req.body;
        let { checkInDate, checkOutDate } = req.body;

        // 解析字符串日期并将其转换为 Date 对象
        checkInDate = new Date(checkInDate);
        checkOutDate = new Date(checkOutDate);

        const hotel = await Hotel.findById(req.params.hotelId);

        if (!hotel) {
            return res.status(404).json({ message: '找不到指定的酒店' });
        }
        console.log(hotel.rooms);
        // 查找指定房型的可用房间
        const availableRooms = hotel.rooms.filter(room => room.type === roomType && room.status === 'available');
        console.log(availableRooms);
        if (availableRooms.length === 0) {
            return res.status(400).json({ message: '房间已满' });
        }

        // 随机选择一个可用房间
        const randomIndex = Math.floor(Math.random() * availableRooms.length);
        const selectedRoom = availableRooms[randomIndex];

        // 创建订单对象
        const createOrder = new Order({
            username: decoded.username,
            hotelId: req.params.hotelId,
            state: 'valid', // 订单状态可以根据需求设置
            makeData: new Date(), // 订单创建日期
            checkInDate,
            checkOutDate,
            price: selectedRoom.price, // 使用选定的房间的价格
            roomType,
            roomNum: 1, // 一次只能预订一个房间
            paymentStatus: false, // 订单支付状态，可以根据需求设置
        });

        // 更新选定的房间状态为已占用
        selectedRoom.status = 'occupied';

        // 保存订单和更新的房间状态到数据库
        await Promise.all([createOrder.save(), hotel.save()]);

        // 返回成功响应
        res.status(201).json({ message: '订单创建成功', order: createOrder });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: '创建订单时出错' });
    }
});

// 撤销一个订单(在发起订单得一个小时内，可以取消订单)
router.delete('/:orderId', isUserMiddleware, async (req, res) => {
    try {
        // 从请求中获取订单ID
        const orderId = req.params.orderId;

        // 根据订单ID查找订单
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: '订单不存在' });
        }

        // 检查订单是否属于当前登录用户
        // 这里假设用户信息存储在 JWT 令牌中
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        if (order.username !== decoded.username) {
            return res.status(403).json({ message: '无权操作此订单' });
        }

        // 检查订单的创建时间是否在一个小时内
        const currentTime = new Date();
        const orderCreateTime = order.makeData;

        if (currentTime - orderCreateTime > 60 * 60 * 1000) {
            return res.status(400).json({ message: '订单已超过可取消时间' });
        }

        // 获取订单关联的酒店
        const hotel = await Hotel.findById(order.hotelId);

        if (!hotel) {
            return res.status(404).json({ message: '相关酒店不存在' });
        }

        // 找到订单对应的房间
        const room = hotel.rooms.find(room => room.type === order.roomType);

        if (!room) {
            return res.status(404).json({ message: '订单对应的房间不存在' });
        }

        // 将房间状态设置为 "available"
        room.status = 'available';

        // 保存更新后的房间状态
        await hotel.save();

        // 使用 deleteOne() 方法删除订单
        await Order.deleteOne({ _id: orderId });

        res.status(200).json({ message: '订单已取消' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: '取消订单时出错' });
    }
});

// 管理员获取所有订单
router.get('/all', isAdminMiddleware, async (req, res) => {
    try {
        // 查询数据库以获取所有订单信息
        const orders = await Order.find();

        // 将订单信息作为 JSON 响应发送给管理员
        res.status(200).json(orders);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: '获取订单列表时出错' });
    }
})

module.exports = router;