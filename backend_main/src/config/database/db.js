// src/config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'Hekopaydb', 
  'Hekopaydb_owner',
  'npg_UfCk5Omn4huS', 
  {
    host: 'ep-flat-mouse-abwsbejo-pooler.eu-west-2.aws.neon.tech',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    },
    logging: false, 
  }
);


module.exports = sequelize;

