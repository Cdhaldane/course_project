const pg = require('pg');

const connectionString = 'postgres://postgres:postgres@localhost:5432/your_database_name';


const pool = new pg.Pool({
    connectionString: connectionString
  });

module.exports = pool;