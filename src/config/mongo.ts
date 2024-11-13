import dotenv from 'dotenv';
import { ConnectOptions } from 'mongoose';

dotenv.config({ path: '.env' });

const mongoOpts: ConnectOptions = {
};

const mongoConfig = {
    url: process.env.DB_URL,
    configs: mongoOpts,
}

export default mongoConfig;