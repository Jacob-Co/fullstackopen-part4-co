const Blog = require('../models/blogs');

const initialBlogs = [
  {
    "title": "How to become a data engineer",
    "author": "Jacob",
    "url": "example.com",
    "likes": 100000,
  },
  {
    "title": "How to raise a happy Bunny",
    "author": "Isabel",
    "url": "bunny.com",
    "likes": 9900000,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'none',
    author: 'none',
    url: 'none.com',
    likes: 0
  });

  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const allBlogs = await Blog.find({});
  return allBlogs.map((b) => b.toJSON());
};

module.exports = {initialBlogs, nonExistingId, blogsInDb};