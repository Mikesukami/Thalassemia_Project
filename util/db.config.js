const Sequelize = require('sequelize');
const env = require('./env');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,

  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//import model
// db.blog = require('../model/blog.js')(sequelize, Sequelize);
db.user = require('../model/users.model.js')(sequelize, Sequelize);
db.media = require('../model/media.model.js')(sequelize, Sequelize);

module.exports = db;