import express from 'express';
import bodyParser from 'body-parser';
import rideRoutes from './routes/ride';
import authRoutes from './routes/userAuth';
import userRoutes from './routes/user';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/v1/rides', rideRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);


const port = process.env.PORT || 3000;
app.listen(port);

export default app;
