
import { config as dotenvConfig } from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import routes from './routes';
import {httpErrorHandler} from "./middleware/httpErrorHandler";

dotenvConfig();

const { PORT = '5000'  } = process.env;

const initServer = async () => {
    // Initialize Express app
    const app = express();

    // Global middlewares
    app.use(cors());
    app.use(bodyParser.json());
    app.use(express.urlencoded({ extended: true }));

    // Initiate routes
    routes.forEach(({ path, route }) => {
        app.use(path, route);
        console.log(`🚀 Route initialized: ${path}`);
    });

    // Register the error-handling middlewares
    app.use(httpErrorHandler);

    // Start server
    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('Shutting down server...');
        process.exit(0);
    });
};

// Execute the initialization
initServer().catch(async (error) => {
    console.error('❌ Error during server initialization:', error);
    process.exit(-1);
});
