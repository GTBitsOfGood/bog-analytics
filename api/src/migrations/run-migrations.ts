import { updateProjectPrivateDataAndDeletionPolicy } from "@/src/migrations/private-data-and-deletion-policy";

const PRODUCTION_MODE = true;

// Make sure you add the migrations in order
const MIGRATIONS: Array<(productionMode: boolean) => Promise<void>> = [
    updateProjectPrivateDataAndDeletionPolicy
];

(async function () {
    for (const migration of MIGRATIONS) {
        await migration(PRODUCTION_MODE);
    }
})();