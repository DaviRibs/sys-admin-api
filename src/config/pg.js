const pg = require("pg")
require("dontenv").config()
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URI,
})

module.exports = db
