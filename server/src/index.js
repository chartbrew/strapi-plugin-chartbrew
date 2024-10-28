'use strict';

/**
 * Application methods
 */
const bootstrap = require('./bootstrap');
const destroy = require('./destroy');
const register = require('./register');

/**
 * Plugin server methods
 */
const config = require('./config');
const contentTypes = require('./content-types');
const controllers = require('./controllers');
const middlewares = require('./middlewares');
const policies = require('./policies');
const routes = require('./routes');
const services = require('./services');

module.exports = {
  bootstrap,
  destroy,
  register,

  config,
  controllers,
  contentTypes,
  middlewares,
  policies,
  routes,
  services,
};
