const mongoose = require('mongoose');
const User = require('./models/user'); // 请根据你的项目结构调整路径
const Hotel = require('./models/hotel'); // 请根据你的项目结构调整路径
require('dotenv').config();

const DB_URL = process.env.DB_URL;
// 连接到 MongoDB 数据库
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 生成假用户数据
async function generateUsers() {
  try {
    await User.deleteMany(); // 清空现有用户数据

    const users = [
      {
        username: 'user1',
        password: 'password1',
        email: 'user1@example.com',
        bio: 'User 1 bio',
        province: 'Province 1',
        city: 'City 1',
        county: 'County 1',
      },
      {
        username: 'user2',
        password: 'password2',
        email: 'user2@example.com',
        bio: 'User 2 bio',
        province: 'Province 2',
        city: 'City 2',
        county: 'County 2',
      },
      // 添加更多用户数据
    ];

    await User.insertMany(users);
    console.log('Users inserted successfully');
  } catch (error) {
    console.error('Error generating users:', error);
  }
}

// 生成假酒店数据
async function generateHotels() {
  try {
    await Hotel.deleteMany(); // 清空现有酒店数据

    const hotels = [
      {
        name: 'Hotel 1',
        city: 'City 1',
        address: 'Address 1',
        starRating: 4,
        isOpen: true,
        rooms: [
          {
            status: 'available',
            type: 'standard',
            price: 100,
            image: 'hotel1.jpg',
          },
          // 添加更多房间数据
        ],
      },
      {
        name: 'Hotel 2',
        city: 'City 2',
        address: 'Address 2',
        starRating: 5,
        isOpen: true,
        rooms: [
          {
            status: 'available',
            type: 'double',
            price: 150,
            image: 'hotel2.jpg',
          },
          // 添加更多房间数据
        ],
      },
      // 添加更多酒店数据
    ];

    await Hotel.insertMany(hotels);
    console.log('Hotels inserted successfully');
  } catch (error) {
    console.error('Error generating hotels:', error);
  }
}

// 调用生成数据函数
generateUsers();
generateHotels();











