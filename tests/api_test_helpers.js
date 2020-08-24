const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Blog = require('../models/blogs');
const User = require('../models/users');

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

const deleteAllUsersInDb = async () => {
  await User.deleteMany({});
};

const createUserInDb = async () => {
  const passwordHash = await bcrypt.hash('test123', 10);
  const newUser = new User({ username: 'test', passwordHash });

  await newUser.save();
};

const getWebTokenOfFirstUser = async () => {
  const user = await User.findOne({});
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);
  return token;
};

const usersInDb = async () => {
  const allUsers = await User.find({});
  return allUsers.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  getWebTokenOfFirstUser,
  createUserInDb,
  deleteAllUsersInDb,
};
