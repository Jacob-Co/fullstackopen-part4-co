const info = (...params) => {
  if (NODE_ENV !== 'test') console.log(...params);
}

const error = (...params) => console.log(...params);

module.exports = {info, error};