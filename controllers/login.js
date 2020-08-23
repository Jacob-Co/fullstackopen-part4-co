const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/users');

loginRouter.post('/', async (request, response) => {
  const { body } = request;
  const user = await User.findOne({ username: body.username });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash);
  if (!user || !passwordCorrect) {
    return response.send(401).json({ error: 'invalid username or password' });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jsonwebtoken.sign(userForToken, process.env.SECRET);
  response.send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
