const blogsRouter = require('express').Router();
const Blog = require('../models/blogs');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);
  const returnedBlog = await blog.save();
  response.status(201).json(returnedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  const { body } = request;
  const updatedBlog = {
    author: body.author || 'n/a',
    title: body.title,
    url: body.url,
    likes: body.likes || 0,
  };
  const returnedBlog = await Blog.findByIdAndUpdate(id, updatedBlog, {
    new: true,
    runValidators: true,
  });

  if (!returnedBlog) return response.status(404).end();

  response.json(returnedBlog);
});

module.exports = blogsRouter;
