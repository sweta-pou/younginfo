require("dotenv").config();

const pg = require('pg');
 var client = new pg.Client({connectionString:process.env.DATABASE_URL,ssl: { rejectUnauthorized: false }})
 client.connect();

  
module.exports = client;