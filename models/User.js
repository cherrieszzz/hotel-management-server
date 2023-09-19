const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  bio: {
    type:String,
  },
  province : {
    type:String,
    required:true
  },
  city: {
    type:String,
    required:true
  },
  county: {
    type:String,
    required:true
  }
  // 可以添加其他个人资料字段
});

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
