'use strict';

/**
 *  service.
 */

const { createCoreService } = require('@strapi/strapi').factories;
const request = require('request-promise');

function getPluginStore() {
  return strapi.store({
    environment: '',
    type: 'plugin',
    name: 'chartbrew',
  });
}
async function createDefaultConfig() {
  const pluginStore = getPluginStore();
  const value = {
    host: 'https://api.chartbrew.com',
    clientHost: 'https://app.chartbrew.com',
    strapiHost: process.env.STRAPI_ADMIN_BACKEND_URL || '',
    token: '',
    hasToken: false,
  };
  await pluginStore.set({ key: 'settings', value });
  return pluginStore.get({ key: 'settings' });
}


module.exports = createCoreService('plugin::chartbrew.chartbrew', {
  async getSettings() {
    const pluginStore = getPluginStore();
    let config = await pluginStore.get({ key: 'settings' });
    if (!config) {
      config = await createDefaultConfig();
    }

    return config;
  },

  async setSettings(settings) {    
    console.log("settings", settings);
    const pluginStore = getPluginStore();
    const config = await pluginStore.get({ key: 'settings' });

    const newConfig = { ...config, ...settings.body };
    if (newConfig.strapiToken) newConfig.hasToken = true;
    if (!newConfig.strapiToken) {
      newConfig.hasToken = false;
    }

    console.log("newConfig", newConfig);

    await pluginStore.set({ key: 'settings', value: newConfig });

    return pluginStore.get({ key: 'settings' });
  },

  async generate(data) {
    const templateData = data;

    const pluginStore = getPluginStore();
    const config = await pluginStore.get({ key: 'settings' });

    templateData.strapiToken = config.strapiToken;
    templateData.strapiHost = config.strapiHost;

    // get the api prefix
    const apiEndpoint = strapi.config.api?.rest?.prefix?.replace('/', '');
    templateData.apiEndpoint = apiEndpoint;
    console.log("strapi.config", strapi.config);

    let project;
    // create a new project first
    if (!templateData.projectId) {
      const createOpt = {
        url: `${config.host}/project`,
        method: 'POST',
        form: {
          name: `${templateData.collection} report`,
          team_id: templateData.teamId,
        },
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: `Bearer ${config.token}`,
        },
        json: true,
      };

      project = await request(createOpt);
    } else {
      project = await request({
        url: `${config.host}/project/${templateData.projectId}`,
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${config.token}`,
        },
        json: true,
      });
    }

    const cbOptions = {
      url: `${config.host}/project/${project.id}/template/strapi`,
      method: 'POST',
      form: templateData,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${config.token}`,
      },
      json: true,
    };

    await request(cbOptions);

    return project;
  }
});
