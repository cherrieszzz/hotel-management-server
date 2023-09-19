const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['occupied', 'available'],
    default: 'available',
  },
  num: {
    type: Number,
    required:true,
    unique:true
  },
  type: {
    type: String,
    enum: ['standard', 'double'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: String,
});

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: String,
  address: String,
  starRating: {
    type: Number,
    required: true,
    min: 1, // 最小值
    max: 5, // 最大值
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  rooms: [roomSchema],
  // 可以添加其他酒店信息字段
});

const Hotel = mongoose.model('Hotels', hotelSchema);

module.exports = Hotel;
