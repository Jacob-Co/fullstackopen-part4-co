const mongoose = require('mongoose');

const config = require('./utils/config');
const logger = require('./utils/logger')

const mongoUrl = config.MONGODB_URI;
console.log('Connecting to MongoDB...')
mongoose.connect(mongoUrl, { 
  useNewUrlParser: true,
  useUnifiedTopology: true 
})
  .then(() => logger.info('Connected to MongoDB'))

