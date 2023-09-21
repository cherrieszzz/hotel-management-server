const express = require('express');
const router = express.Router();
const Hotel = require('../../models/Hotel');
const isAdminMiddleware = require('../../middlewares/isAdminMiddleware');

router.get('/:hotelId', async (req, res) => {
    const hotelId = req.params.hotelId; // 从URL参数中获取酒店ID
    const num = req.query.num; // 从查询参数中获取num值

    try {
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).json({ message: '酒店未找到' });
        }

        if (!num) {
            return res.send(hotel.rooms);
        }

        // 使用数组的 find 方法查找符合条件的房间
        const room = hotel.rooms.find(room => room.num === parseInt(num, 10));

        if (!room) {
            return res.status(404).json({ message: '房间未找到' });
        }

        res.json(room); // 返回匹配的房间对象
    } catch (error) {
        res.status(500).json({ message: '服务器错误' });
    }
});

// POST请求用于添加新的房间
router.post('/:hotelId/add-room', isAdminMiddleware, async (req, res) => {
    const hotelId = req.params.hotelId; // 从URL参数中获取酒店ID
    const newRoomData = req.body; // 从请求体中获取新房间的数据

    try {
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).json({ message: '酒店未找到' });
        }

        // 创建一个新的房间对象并将其添加到酒店的 rooms 数组中
        hotel.rooms.push(newRoomData);

        // 保存酒店对象以将新房间添加到数据库
        await hotel.save();

        res.status(201).json({ message: '房间已成功添加', room: newRoomData });
    } catch (error) {
        res.status(500).json({ message: '服务器错误' });
    }
});

router.delete('/:hotelId/room/:roomId', isAdminMiddleware, async (req, res) => {
    try {
        const hotelId = req.params.hotelId;
        const roomId = req.params.roomId;

        // 使用 Mongoose 找到指定酒店
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).json({ message: '酒店未找到' });
        }

        // 使用 Mongoose 删除指定的房间
        const room = hotel.rooms.id(roomId);

        if (!room) {
            return res.status(404).json({ message: '房间未找到' });
        }

        room.remove();

        // 保存更新后的酒店信息
        await hotel.save();

        return res.json({ message: '房间删除成功' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: '服务器错误' });
    }
})
module.exports = router;