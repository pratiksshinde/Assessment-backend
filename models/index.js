const sequelize = require('../config/database');

const User = require('./users');
const Deal = require('./deals');
const Interest = require('./interests');
const Investment = require('./investment');
const InvestorPreference = require('./investor_preferences');

const models = { User, Deal, Interest, Investment, InvestorPreference };

Object.values(models).forEach(model => {
  if (model.associate) model.associate(models);
});


sequelize.sync({ alter: true })
  .then(() => console.log('All tables synced'))
  .catch(err => console.error('Sync error:', err));

module.exports = { sequelize, ...models };