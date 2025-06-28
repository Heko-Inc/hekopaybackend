const { Sequelize } = require('sequelize');


require("dotenv").config()



const DATABASE_NAME=process.env.DATABASE_NAME;




const HEKOPAYDB_OWNER=process.env.HEKOPAYDB_OWNER;




const PASSWORD=process.env.DATABASE_PASSWORD;




const sequelize = new Sequelize(

  DATABASE_NAME, 

  HEKOPAYDB_OWNER,

  PASSWORD, 

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



const DATABASE_URL = `postgresql://${HEKOPAYDB_OWNER}:${PASSWORD}@ep-flat-mouse-abwsbejo-pooler.eu-west-2.aws.neon.tech/${DATABASE_NAME}?sslmode=require`

module.exports = { sequelize, DATABASE_URL };
