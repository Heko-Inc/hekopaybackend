const express = require("express");


const { sequelize } = require("./db");

const connectDatabase = async () => {

    try {

        await sequelize.authenticate();

        console.log("Database connection has been established successfully.");

    } catch (error) {

        console.error("Unable to connect to the database:", error);


    }

}

module.exports = connectDatabase;