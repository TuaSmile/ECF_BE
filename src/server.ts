import dotenv from 'dotenv';
dotenv.config({ path: '.env' });


// Cluster
import cluster from 'cluster';
import os from 'os';

// Express
import express from 'express';

// Mongoose
import mongoose from 'mongoose';
import mongoConfig from './config/mongo';
mongoose.connect(mongoConfig.url as string, mongoConfig.configs).then(async () => {
    console.log("Connected to MongoDB");
})


// Mids
import cors from 'cors';
import morgan from 'morgan';

// Routes
import routes from './routes';


// Express
const app = express();


// Mids
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(routes);


app.listen(process.env.HTTP_PORT || 3333, () => {
    console.log(`Listening to port ${process.env.HTTP_PORT || 3333}`)
})