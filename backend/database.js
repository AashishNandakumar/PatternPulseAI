const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: "3307",
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) console.error("Error connecting to database ", err);
  else console.log("Connected to dabase");
});

function createDatabase() {
  const sql = `CREATE DATABASE IF NOT EXISTS DatasetMorseCode`;

  connection.query(sql, (err) => {
    if (err) console.error("Error creating the database ", err);
    else console.log('Table "DatasetMorseCode" created successfully');
  });
}

function createTable() {
  const sql = `
  CREATE TABLE IF NOT EXISTS training_data(
      id INT AUTO_INCREMENT PRIMARY KEY, 
      input VARCHAR(255) NOT NULL, 
      output VARCHAR(255) NOT NULL,
      CONSTRAINT uc_value UNIQUE (output)
    )
    `;

  connection.query(sql, (err) => {
    if (err) console.error("Error creating the table ", err);
    else console.log('Table "training_data" created successfully');
  });
}

module.exports = { connection, createTable, createDatabase };
