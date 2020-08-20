// 3rd Party Modules
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

// Local Modules
require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');
const Blog = require('./models/blogs');
const blogsRouter = require('./controllers/blogs');

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter);


app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
