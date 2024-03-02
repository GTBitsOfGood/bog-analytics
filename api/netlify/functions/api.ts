import bodyParser from 'body-parser';
import compression from 'compression';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import { router } from '@/src/routes';
import { ApplicationError } from '@/src/errors/application-error';
import cors from "cors"

import serverless from "serverless-http";
export let api = express();

api.use(compression());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));
const allowedOrigins = ['http://localhost:8501', 'https://analytics.bitsofgood.org', 'https://bog-analytics.streamlit.app/'];

api.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

api.set('port', process.env.PORT || 3001);
api.use('/api', router);

api.use((err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }

    return res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'development' ? err : undefined,
        message: err.message
    });
});

export const handler = serverless(api);