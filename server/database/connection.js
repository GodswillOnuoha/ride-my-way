
import pg from 'pg';
import log from 'fancy-log';

const connectionString = 'postgres://lvxargangazpdj:07a21479e345a468d8f2f21884bd3853a366b42f05618485097c6c09eedc744b@ec2-54-235-73-241.compute-1.amazonaws.com:5432/d2t06euusmki4k?ssl=true';
const db = new pg.Pool({ connectionString });

db.connect((err) => {
  if (err) {
    log.error('Idle client error', err.message, err.stack);
  } else {
    log('CONNECTED');
  }
});


export default db;
