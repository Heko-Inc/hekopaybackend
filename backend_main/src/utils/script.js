const { Sequelize } = require("sequelize");


const db = require("../models/index"); 


(async () => {

  try {

    await db.sequelize.sync({ alter: true }); 

    console.log('✅ All models synced.');

  } catch (error) {

    console.error("Error syncing DB:", error);

  } finally {

    await db.sequelize.close();

  }
})();
