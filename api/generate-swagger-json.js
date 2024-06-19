// @ts-nocheck 

import { writeFile } from 'fs/promises';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: "3.0.0",
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
    apis: ["./src/utils/*.ts", "./src/controllers/events/*.ts", "./src/controllers/gdpr/*.ts", "./src/controllers/graphs/*.ts",],
};

const specs = swaggerJsdoc(options);

writeFile('swagger.json', JSON.stringify(specs, null, 2), 'utf-8');
