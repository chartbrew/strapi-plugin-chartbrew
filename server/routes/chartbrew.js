'use strict';

/**
 *  router.
 */

module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/',
      handler: 'chartbrew.get',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/settings',
      handler: 'chartbrew.getSettings',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/settings',
      handler: 'chartbrew.setSettings',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/models',
      handler: 'chartbrew.getModels',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/generate',
      handler: 'chartbrew.generateTemplate',
      config: {
        policies: [],
      },
    }
  ],
};