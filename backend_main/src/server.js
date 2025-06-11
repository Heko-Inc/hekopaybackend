const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000;

const connectDatabase = require("./config/database/connectionDb");
















app.listen(PORT, async () => {

    try{
        
        await connectDatabase();

        console.log(`Server is running on port ${PORT}`);

    }catch(error) {

        console.error("Error starting the server:", error);

        process.exit(1);
    }


})