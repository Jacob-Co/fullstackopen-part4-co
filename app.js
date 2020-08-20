const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const blogsRouter = require('./controllers/blogs');
const config = require('./utils/config');
const logger = require('./utils/logger');

const mongoUrl = config.MONGODB_URI;
console.log('Connecting to MongoDB...')
mongoose.connect(mongoUrl, { 
  useNewUrlParser: true,
  useUnifiedTopology: true 
})
  .then(() => logger.info('Connected to MongoDB'))

const app = express();

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter);

module.exports = app;
