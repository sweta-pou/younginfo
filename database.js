require("dotenv").config();

const pg = require('pg');
 var client = new pg.Client({connectionString:process.env.DATABASE_URL,ssl:true})
 client.connect();

  
module.exports = client;