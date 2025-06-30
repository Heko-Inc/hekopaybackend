const path = require("path")

require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });


const db = require("./index.js"); 


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
