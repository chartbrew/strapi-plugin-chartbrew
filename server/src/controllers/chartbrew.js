'use strict';

const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('chartbrew')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },

  async get() {
    await strapi.query('plugin::chartbrew.chartbrew').findMany();
  },

  async getSettings(ctx) {
    try {
      const settings = await strapi.plugin('chartbrew').service('chartbrew').getSettings();

      // make sure the Strapi token is not included in the response
      delete settings.strapiToken;

      ctx.body = settings;

    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async setSettings(ctx) {
    const { body } = ctx.request;
    try {
      await strapi.plugin('chartbrew').service('chartbrew').setSettings(body);

      const newSettings = await strapi.plugin('chartbrew').service('chartbrew').getSettings();
      // make sure the Strapi token is not included in the response
      delete newSettings.strapiToken;

      ctx.body = newSettings;
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async getModels(ctx) {
    try {
      const models = await strapi.db.config.models;

      // re-format the structure and only fetch the collection types
      const formattedModels = models.filter((m) => m.kind === 'collectionType').map((model) => ({
        ...model.info,
        kind: model.kind,
        attributes: model.attributes,
        uid: model.uid,
      }));

      ctx.body = formattedModels;
    } catch (err) {
      ctx.throw(400, err);
    }
  },

  async generateTemplate(ctx) {
    const { body } = ctx.request;
    try {
      const project = await strapi.plugin('chartbrew').service('chartbrew').generate(body);

      ctx.body = project;
    } catch (err) {
      ctx.throw(400, err);
    }
  },
});

module.exports = controller;
