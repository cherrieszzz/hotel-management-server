const express = require('express');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const hotelRouter = require('./routes/hotels');
const roomRouter = require('./routes/rooms');
const meRouter = require('./routes/me');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const DB_URL = process.env.DB_URL;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true }))
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/hotels', hotelRouter);
app.use('/rooms', roomRouter);
app.use('/me', meRouter);

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to the database!!!!!');
  })
  .catch((error) => {
    console.error('Error connecting to the database!!!!!', error);
  });

app.listen(3000, function () {
  console.log('应用正在监听3000端口!');
});