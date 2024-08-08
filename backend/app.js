const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const Post = require('./models/post');
const authMiddleware = require('./middleware/check.auth');

const app = express();
app.use('/images', express.static(path.join('backend/images')));
app.use(cors());

const postRoute = require('./routes/post');
const userRoute = require('./routes/user');

const uri = 'mongodb+srv://admin:admin@cluster0.tcrln.mongodb.net/';

async function run() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

run().catch(console.dir);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT');
  next();
});

app.use('/api/posts', postRoute);
app.use('/api/user', userRoute);
app.use(authMiddleware);

module.exports = app;
