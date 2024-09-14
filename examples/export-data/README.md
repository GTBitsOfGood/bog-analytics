<div align="center"> 
<h1>Data Export Example</h1></div>

</div>
This example project demonstrates how to utilize the Bog Analytics API and NPM package to export analytics data (click, visit, input, and custom events) from Bog Analytics into a local MongoDB instance for custom querying. We have provided an example of how developers can integrate Bog Analytics data in their own databases for further analysis.

## Components:

1. **main.ts:** Project script that handles the process of fetching analytics data, creating mock events (if necessary), and exporting them into MongoDB. This script fetches events like click, visit, input, and custom events from Bog Analytics and writes them into your local database.
2. **export-data.yml** Github Actions Workflow that runs the script periodically

## Setup

1. Install Dependencies

```
yarn install
```

2. Set up Bog Analytics API keys:

```
   CLIENT_API_SECRET=your_client_api_key
   SERVER_API_SECRET=your_server_api_key
   MONGO_URI=mongodb://localhost:27017/your_db_name
```

**Note:** If not yet done, create an account at our [analytics portal](https://portal.analytics.bitsofgood.org) and then create a project to get your API keys. You'll need to get your account verified by a Bits of Good admin.

3. MongoDB running locally via Docker (using Docker Compose)

```
cd examples/export-data
docker-compose -f docker-compose.yml up
```

If you make any changes to the packages, you may need to rebuild the images. To do this, append `--build` to the above docker compose up command. The Dockerized application will have live-reloading of changes made on the host machine.

4. Run the export script

```
yarn export-data
```

## How It Works

-   **Project Initialization:** The script checks whether your project exists in MongoDB. If not, it creates the project using the provided API keys
-   **Fetch Event Data:** The script authenticates using the Bog Analytics Viewer module to fetch various event types (Click, Input, Visit, Custom)
-   **Generate Mock Events:** The script generates mock events using the Bog Analytics Logger module for testing purposes.
-   **Exporting Data to MongoDB:** The fetched event data is inserted into the MongoDB database using Mongoose models.
-   **GitHub Actions Workflow:** You can set up a GitHub Actions workflow that runs the script periodically.
