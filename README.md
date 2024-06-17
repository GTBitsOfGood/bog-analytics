
<div align="center"> 
<h1>Bits of Good Analytics</h1></div>

<div align="center"> 

[Dashboard](https://analytics.bitsofgood.org) | [Portal](https://portal.analytics.bitsofgood.org) | [API Docs](https://analytics.bitsofgood.org/docs) | [Package](https://www.npmjs.com/package/bog-analytics) | [Package Docs](https://github.com/GTBitsOfGood/bog-analytics/tree/main/docs)

</div>

This is the unified Bits of Good analytics platform. It is designed with interoperability and plug-in-play in mind to be able to work with any Bits of Good project. There are four primary components to this analytics platform:

- **Dashboard:** This is the core of the analytics dashboard and is where all of the data visualizations are located. This is written and built complately using Streamlit and Python - it is deployed using Streamlit's cloud service.

- **Analytics Processing API:** This is the data API that ingests data from our websites and stores it into one universal location for all our projects. This allows Bits of Good to gather and act on the data we collect.

- **Package:** A publically accessible NPM package to interface with the Analytics Processing API.

- **Bits of Good Analytics Portal:** A portal to create and manage projects and event types.

## Install Bits of Good Analytics
To install Bits of Good Analytics, you can install it via yarn or npm. 

Using yarn:

```
yarn add bog-analytics
```
Using npm:
```
npm i bog-analytics
```

Create an account at our [analytics portal](https://portal.analytics.bitsofgood.org) and then create a project to get your API keys. Head over to our [package docs](https://github.com/GTBitsOfGood/bog-analytics/tree/main/docs) to start interfacing with bog analytics.

**Note:** You'll need to get your account verified by a Bits of Good admin.

## Event Interfaces

We define a couple of different event types that are unified across Bits of Good projects - this list is non-exhaustive and can definitely be extended in the future:
- Click Events: These are events that occur when a user takes a click action (i.e. clicks a button or clicks a tab, etc.)
```
{
    "Category": "Interaction",
    "Subcategory": "Click",
    "Event Properties": {
        "ObjectId": "id of the object (i.e. a specific button, tab, etc.) that was clicked",
        "UserId": "id of the user who clicked said event"
     }
     "Created At": "Date the event was created at"
}
```
- Visit Events: These are events that occur when a user visits a specific page in an application (i.e. a user visits `/app` or `/home`)
```
{
    "Category": "Activity",
    "Subcategory": "Visit",
    "Event Properties": {
        "PageUrl": "URL of the page that was visited in the app",
        "UserId": "user who visited that page",
     },
     "Created At": "Date the event was created at"
}
```
- Input Events: These are events where a user inputs a specific piece of information into a input box 
```
{
    "Category": "Interaction",
    "Subcategory": "Input",
    "Event Properties": {
        "ObjectId": "id of the object (i.e. a specific text field) where the user inputted data",
        "UserId": "id of the user who inputted the text",
        "TextValue": "value of the text that was submitted into the text field"
     },
     "Created At": "Date the event was created at"
}
```

- Custom Events: Custom events are managed through our custom event type interface 
```
{
    "Category": "specified by you",
    "Subcategory": "specified by you",
    "Event Properties": {
        "property 1": "properties and values specified by you",
        "property 2": "you can create an infinte amount of custom event types with as many properties as you would like",
     },
     "Created At": "Date the event was created at"
}
```
## Setup Repository with Docker (Reccommended)
Because this repository acts as a monorepository for all things analytics, we provide a `docker-compose` for easy setup. To run the application via docker compose:
1. Install [Docker](https://docs.docker.com/engine/install/)
2. Start the application with Docker Compose: `docker compose up`
3. Navigate to the API, Next.js App, or Streamlit App
   1. Streamlit App: `http://localhost:8501/`
   2. API: `http://localhost:3001/`
   3. Portal: `http://localhost:3000/`


If you make any changes to the packages, you may need to rebuild the images. To do this, append `--build` to the above docker compose up command. The first build and subsequent rebuilds will take longer than rerunning the container.

The Dockerized application will have live-reloading of changes made on the host machine.

## Setup Repository Locally
**Step 1:** Install [Node v18.17.0 or newer](https://nodejs.org/en/download/current). If you do not have at least node version 18.17.0 or newer then you will NOT be able to setup this repository. You can use [node version manager](https://github.com/nvm-sh/nvm) to setup the proper node version. If you are using node version manager:
```
nvm install 18.17.0
nvm use 18.17.0
```
**Step 2:** Setting up the API - We use yarn for all Javascript/Typescript related projects. Install yarn as follows:
```
cd api && yarn install
```
**Step 3:** Run the API
```
yarn dev
```
**Step 4:** Open a new terminal and install dependencies for the Next.js App
```
cd example-app && yarn install
```
**Step 5:** Run the example web app:
```
yarn dev
```
**Step 6**: Install [Python 3.8](https://www.python.org/downloads/release/python-380/) or [3.11](https://www.python.org/downloads/release/python-3110/) - if you do not have 3.8 or 3.11, I cannot guarantee this setup will work properly. You can check your version as follows
```
python3 --version
```
**Step 7:** Open a new terminal and create a virtual environment in your dashboard folder:
```
cd dashboard && python3 -m venv venv
```
**Step 8:** Activate the virtual environment:
```
# For Unix/Linux Operating Systems
source venv/bin/activate 

# For Windows Operating Systems
.\venv\Scripts\activate
```
**Step 9:** Install all dependencies
```
pip install -r requirements.txt
```
**Step 10:** Run the streamlit application
```
streamlit run app.py
```
**Step 11:** Navigate to the API, Next.js App, or Streamlit App
   - Streamlit App: `http://localhost:8501/`
   - API: `http://localhost:3001/`
   - Next.js App: `http://localhost:3000/`

## Development Guide
When working on a ticket, follow the steps below:
- **Step 1:** Create a branch in the format `your-name/feature-you-are-working-on`. For example:
```
git checkout -b "samrat/repository-setup"
```
- **Step 2:** Add any changes you make to your files
```
git add .
```
- **Step 3:** Create a commit with a message explaining what you did
```
git commit -m "add graph for visit analytics"
```
**Step 4:** Push your changes to your branch
```
# If you are pushing to your branch for the first time
git push --set-upstream origin samrat/repository-setup

# If you are pushing normally
git push
```