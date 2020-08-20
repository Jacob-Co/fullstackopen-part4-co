const mongoose = require('mongoose');

const config = require('./utils/config');

const mongoUrl = config.MONGODB_URI;
console.log('Connecting to MongoDB...')
mongoose.connect(mongoUrl, { 
  useNewUrlParser: true,
  useUnifiedTopology: true 
})
  .then(() => console.log('Connected to MongoDB'))

