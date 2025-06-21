const { Sequelize } = require('sequelize');


const DATABASE_NAME = "Hekopaydb";



const HEKOPAYDB_OWNER = "Hekopaydb_owner";



const PASSWORD = "npg_UfCk5Omn4huS"


// const sequelize = new Sequelize(

//   DATABASE_NAME, 

//   HEKOPAYDB_OWNER,

//   PASSWORD, 

//   {
//     host: 'ep-flat-mouse-abwsbejo-pooler.eu-west-2.aws.neon.tech',
//     dialect: 'postgres',
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       }
//     },
//     logging: false, 
//   }
// );

const sequelize = new Sequelize("postgresql://neondb_owner:npg_juXmVFrRg52N@ep-orange-glade-a149ppfm-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
);




// const DATABASE_URL = `postgresql://${HEKOPAYDB_OWNER}:${PASSWORD}@ep-flat-mouse-abwsbejo-pooler.eu-west-2.aws.neon.tech/${DATABASE_NAME}?sslmode=require`

module.exports = { sequelize, };
