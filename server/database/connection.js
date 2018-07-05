
import pg from 'pg';
import log from 'fancy-log';
import env from 'dotenv';

env.config();

const connectionString = process.env.HEROKU_CONNECTION_STRING;

const db = new pg.Pool({ connectionString });

db.connect((err) => {
  if (err) {
    log.error('Idle client error', err.message, err.stack);
  } else {
    log('CONNECTED');
  }
});


export default db;
