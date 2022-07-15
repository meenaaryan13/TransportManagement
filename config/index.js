" use strict"
  require('dotenv').config()
  const config={
    port:process.env.port,
    dburi:process.env.dburi,
    dbname:process.env.dbname

  }

  module.exports=config;