// 3rd party modules
const supertest = require('supertest');
const mongoose =  require('mongoose');

// local modules
const app = require('../app');
const Blog = require('../models/blogs');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const newBlogs = [
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

  const convertedBlogs = newBlogs.map((b) => new Blog(b));
  const blogsArr = convertedBlogs.map((b) => b.save());
  await Promise.all(blogsArr);
});

afterAll(() => {
  mongoose.connection.close();
});

test('GET /api/blogs returns the correct number of notes', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const returnBlogs = response.body;
  expect(returnBlogs).toHaveLength(2);
});

test('GET /api/blogs returns id instead of _id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const returnBlogs = response.body;
  expect(returnBlogs[0].id).toBeDefined();
  expect(returnBlogs[0]._id).not.toBeDefined();
});

test('POST /api/blogs creates a new blog document', async () => {
  const newBlog = new Blog({
    title: 'Snoopy Comics',
    author: 'Unknown',
    url: 'snoopy.com',
    likes: 49930
  });

  const blogsAtStart = await Blog.find({});

  const postResponse = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  
  const returnedBlog = postResponse.body
  expect(returnedBlog).toHaveProperty('title', 'Snoopy Comics');

  const blogsAtEnd = await Blog.find({});
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);
  const jsonBlogsAtEnd = blogsAtEnd.map((b) => b.toJSON());
  expect(jsonBlogsAtEnd).toContainEqual(returnedBlog);
});

test('POST /api/blogs will return 0 likes if not are passed in', async () => {
  const newBlog = new Blog({
    title: 'Snoopy Comics',
    author: 'Unknown',
    url: 'snoopy.com'
  });

  const postResponse = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const returnedBlog = postResponse.body;
  expect(returnedBlog).toHaveProperty('likes', 0);
});
