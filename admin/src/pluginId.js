const pluginPkg = require('../../package.json');

const pluginId = pluginPkg.strapi.name.replace(/^(@[^-,.][\w,-]+\/|strapi-)plugin-/i, '').toLowerCase();

module.exports = pluginId;
