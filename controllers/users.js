const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/users');

usersRouter.post('/', async (req, res) => {
  const { body } = req;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const newUser = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await newUser.save();
  res.json(savedUser);
});

module.exports = usersRouter;