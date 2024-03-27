import bodyParser from 'body-parser';
import compression from 'compression';
import express, { Request, Response, NextFunction } from 'express';
import { router } from '@/src/routes';
import { ApplicationError } from '@/src/errors/application-error';
import swaggerUi from 'swagger-ui-express';
import cors from "cors"

import serverless from "serverless-http";
import swaggerJsdoc from 'swagger-jsdoc';
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

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Bits of Good Analytics API",
            version: "1.0.0",
            description:
                "The Unified Bits of Good Analytics API",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Bits of Good",
                url: "https://bitsofgood.org",
                email: "hello@bitsofgood.org",
            },
        },
        servers: [
            {
                url: "https://analytics.bitsofgood.org",
            },
            {
                url: "http://localhost:3001",
            },
        ],
    },
    apis: ["./model-docs.js", "./route-docs.js"],
};

const specs = swaggerJsdoc(options);
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
api.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true, customCssUrl: CSS_URL })
);
export const handler = serverless(api);