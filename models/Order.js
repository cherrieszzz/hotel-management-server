const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  state: {
    type: String,
    enum: ['valid','invalid'],
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  roomType: {
    type: String,
    enum: ['standard', 'double'],
    required: true,
  },
  paymentStatus: {
    type: Boolean,
    required:true,
  }
  // 可以添加其他订单信息字段
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;