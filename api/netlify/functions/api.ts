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

api.use(cors({
    origin: "*"
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