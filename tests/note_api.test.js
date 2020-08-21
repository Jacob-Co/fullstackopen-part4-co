// 3rd party modules
const supertest = require('supertest');

// local modules
const app = require('../app');

const api = supertest(app);