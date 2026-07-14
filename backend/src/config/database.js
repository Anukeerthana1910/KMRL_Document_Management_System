require("dotenv").config();

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql"
    }
);

sequelize.sync({ alter: true })
    .then(() => {
        console.log("Database Tables Updated");
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = sequelize;