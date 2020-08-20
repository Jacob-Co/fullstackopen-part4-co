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

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
