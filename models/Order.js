const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  username: {
    type: String,
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
    required: true,
  },
  makeData:{
    type:Date,
    required:true
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
  roomNum:{
    type:Number,
    required:true,
  },
  paymentStatus: {
    type: Boolean,
    required:true,
  }
  // 可以添加其他订单信息字段
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;