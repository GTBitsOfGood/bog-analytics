import bodyParser from 'body-parser';
import compression from 'compression';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import { router } from '@/routes';
import { ApplicationError } from '@/errors/application-error';
import serverless from "serverless-http";
export let api = express();
const __dirname = new URL('.', import.meta.url).pathname;

api.use(compression());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

api.set('port', process.env.PORT || 3001);
api.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
api.use('/api', router);

api.use('/.netlify/functions/server', router);  // path must route to lambda
api.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

api.use((err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }

    return res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'development' ? err : undefined,
        message: err.message
    });
});

export async function handler(event: Object, context: Object) {
    return serverless(api)(event, context);
}