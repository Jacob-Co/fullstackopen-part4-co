const jwt = require('jsonwebtoken');

const logger = require('./logger');

const errorHandler = (e, req, res, next) => {
  logger.error(e.message);

  if (e.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  if (e.name === 'ValidationError') {
    return res.status(400).json({ error: e.message });
  }

  if (e.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: e.message });
  }

  next(e);
};

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }

  return null;
};

const tokenExtractor = (req, res, next) => {
  const encodedToken = getTokenFrom(req);
  if (!encodedToken) return next();
  const decodedToken = jwt.verify(encodedToken, process.env.SECRET);
  req.token = decodedToken;
  next();
};

module.exports = { errorHandler, tokenExtractor };
