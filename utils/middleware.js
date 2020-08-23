const logger = require('./logger')

const errorHandler = (e, req, res, next) => {
  logger.error(e.message);

  if (e.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id '});
  }

  if (e.name === 'ValidationError') {
    return res.status(400).json({ error: e.message });
  }

  if (e.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: e.message });
  }

  next(e);
};

module.exports = { errorHandler };
