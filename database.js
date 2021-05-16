require("dotenv").config();

const pg = require('pg');
if(process.env.CHECK==='production')
{
  var client = new pg.Client({connectionString:process.env.DATABASE_URL
    ,ssl: { rejectUnauthorized: false }
  })
}
else
{
  var client = new pg.Client({connectionString:process.env.DATABASE_URL
  })
}
 
 client.connect();

  
module.exports = client;