import express from 'express';
import helmet from 'helmet';
import {PORT} from './config/server-config.js';
import connectDB from './config/database.js';

const app = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function startServer() {
    await connectDB();
    app.listen(PORT, () => {
        console.log('Server listening on port ' + PORT);
    });
}

startServer();