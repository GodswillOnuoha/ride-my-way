import express from 'express';
import bodyParser from 'body-parser';
import Ride from './routes/ride';
import Auth from './routes/auth';
import User from './routes/user';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/v1/rides', Ride);
app.use('/api/v1/auth', Auth);
app.use('/api/v1/users', User);


const port = process.env.PORT || 3000;
app.listen(port);

export default app;
