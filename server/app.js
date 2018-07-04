import express from 'express';
import bodyParser from 'body-parser';
import rideRoutes from './routes/ride';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/v1/rides', rideRoutes);


const port = process.env.PORT || 3000;
app.listen(port);

export default app;
