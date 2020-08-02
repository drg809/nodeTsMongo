import {app} from './app';
import * as http from 'http';
import {MongoHelper} from './helpers/mongo.helper';
import * as mongoose from "mongoose";
import config from "./helpers/config";


const port = config.port;
const server = http.createServer(app);

server.listen(port);
server.on('error', (err) => {
    console.error(err);
});

const MONGO_URI = 'mongodb://127.0.0.1:27017/users';
server.on('listening', async () => {
    console.info(`Listening on port ${port}`);
    mongoose.connect(MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true});
    mongoose.connection.once('open', () => {
        console.info('Connected to Mongo via Mongoose');
    });
    mongoose.connection.on('error', (err) => {
        console.error('Unable to connect to Mongo via Mongoose', err);
    });
});
