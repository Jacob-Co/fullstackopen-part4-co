const blogsRouter = require('express').Router();
const Blog = require('../models/blogs');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);
  const returnedBlog = await blog.save();
  response.status(201).json(returnedBlog);
})

module.exports = blogsRouter;