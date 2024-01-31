import { api } from "./api";
import { logger } from "@/logger";

api.listen(api.get('port'), (): void => {
    console.log('\x1b[36m%s\x1b[0m', // eslint-disable-line
        `🌏 Express server started at http://localhost:${api.get('port')}   `);
});