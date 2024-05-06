import { api } from "@/netlify/functions/api";
import { config } from "dotenv";

config()
api.listen(api.get('port'), (): void => {
    console.log('\x1b[36m%s\x1b[0m', // eslint-disable-line
        `🌏 Express server started at http://localhost:${api.get('port')}   `);
});