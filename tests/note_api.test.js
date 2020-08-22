// 3rd party modules
const supertest = require('supertest');
const mongoose =  require('mongoose');

// local modules
const app = require('../app');
const Blog = require('../models/blogs');
const testHelper = require('./note_api_test_helpers');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const convertedBlogs = testHelper.initialBlogs.map((b) => new Blog(b));
  const saveBlogsArr = convertedBlogs.map((b) => b.save());
  await Promise.all(saveBlogsArr);
});

afterAll(() => {
  mongoose.connection.close();
});

describe('Testing server', () => {
  describe('GET /api/blogs', () => {
    test('returns the correct number and correct notes', async () => {
      const allBlogs = await testHelper.blogsInDb();
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    
      const returnBlogs = response.body;
      expect(returnBlogs).toHaveLength(allBlogs.length);
      expect(returnBlogs).toEqual(allBlogs);
    });
    
    test('returns id instead of _id', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    
      const returnBlogs = response.body;
      expect(returnBlogs[0].id).toBeDefined();
      expect(returnBlogs[0]._id).not.toBeDefined();
    });
  });
  
  describe('POST /api/blogs', () => {
    test('creates a new blog document', async () => {
      const newBlog = new Blog({
        title: 'Snoopy Comics',
        author: 'Unknown',
        url: 'snoopy.com',
        likes: 49930
      });
    
      const blogsAtStart = await testHelper.blogsInDb();
    
      const postResponse = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);
      
      const returnedBlog = postResponse.body
      expect(returnedBlog).toHaveProperty('title', 'Snoopy Comics');
    
      const blogsAtEnd = await testHelper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);
      expect(blogsAtEnd).toContainEqual(returnedBlog);
    });
    
    test('will return 0 likes if no likes are passed in', async () => {
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
    
    test('with missing title or url', async () => {
      const noUrl = new Blog({
        title: 'Snoopy Comics',
        author: 'Unknown',
      });
      const expectedUrlError = 'Blog validation failed: url: Path `url` is required.';
      const postResponse = await api
        .post('/api/blogs')
        .send(noUrl)
        .expect(400);
      
      expect(postResponse.body.error).toEqual(expectedUrlError);
    
      const noTitle = new Blog ({
        author: 'Unknown',
        url: 'comic.com'
      });
      const expectedUrlError2 = 'Blog validation failed: title: Path `title` is required.';
      const postResponse2 = await api
        .post('/api/blogs')
        .send(noTitle)
        .expect(400);
      
      expect(postResponse2.body.error).toEqual(expectedUrlError2);
    });
  });

  describe('DELETE /api/blogs/:id', () => {
    test('DELETE /api/blogs/:id will remove a blog', async () => {
        const allBlogsStart = await testHelper.blogsInDb();
        const firstBlog = allBlogsStart[0];
      
        await api
          .delete(`/api/blogs/${firstBlog.id}`)
          .expect(204);
      
        const allBlogsEnd = await testHelper.blogsInDb();
        expect(allBlogsEnd).toHaveLength(allBlogsStart.length - 1);
        expect(allBlogsEnd).not.toContainEqual(allBlogsStart);
      });
  });

  describe('PUT /api/blogs/:id', () => {
    test('update a blog when given the correct info', async () => {
      const allBlogsStart = await testHelper.blogsInDb();
      const blogToUpdate = allBlogsStart[0];
      const updatedBlog = {
        title: 'PUT',
        author: 'Mr. PUT',
        url: 'PUT.com',
        likes: 1
      };
      const putResponse = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      
      const returnBlog = putResponse.body;
      expect(returnBlog).toHaveProperty('title','PUT');
      expect(returnBlog).toHaveProperty('url','PUT.com');

      const allBlogsEnd = await testHelper.blogsInDb();
      expect(allBlogsEnd).toContainEqual(returnBlog);
    });

    test('if given no title return 400 error', async () => {
      const allBlogsStart = await testHelper.blogsInDb();
      const blogToUpdate = allBlogsStart[0];
      const updatedBlog = {
        author: 'Mr. PUT',
        url: 'PUT.com',
        likes: 1
      };
      const putResponse = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(400);
      
      const allBlogsEnd = await testHelper.blogsInDb();
      expect(allBlogsEnd).toEqual(allBlogsStart);
    });

    test('if given no title return 400 error', async () => {
      const allBlogsStart = await testHelper.blogsInDb();
      const blogToUpdate = allBlogsStart[0];
      const updatedBlog = {
        title: 'PUT',
        author: 'Mr. PUT',
        likes: 1
      };
      const putResponse = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(400);
      
      const allBlogsEnd = await testHelper.blogsInDb();
      expect(allBlogsStart).toEqual(allBlogsEnd);
    });
  });
});