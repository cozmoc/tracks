const users = require('./users');
const tracks = require('./tracks');

const routes = {
  users,
  tracks,
};

module.exports = app => Object.keys(routes).forEach(route => {
  app.use(`/api/${route}`, routes[route]);
});
