import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dbConnect } from './utils/db-connect';
import { AnalyticsViewer, AnalyticsLogger, AnalyticsManager } from "bog-analytics";
import { ClickEventModel } from './models/click-event';
import { VisitEventModel } from './models/visit-event';
import { InputEventModel } from './models/input-event';
import { CustomEventModel } from './models/custom-event';
import { Project } from './utils/types';
import { EventEnvironment } from './utils/types';
import { getProjectIDByName, createProject } from './actions/project'

dotenv.config();
const CLIENT_KEY = process.env.CLIENT_API_SECRET || '';
const SERVER_KEY = process.env.SERVER_API_SECRET || '';
const projectName = "Bits of Good Example Project";

const main = async () => {
    try {
        await dbConnect();
        console.log('Connected to MongoDB');

        // Create the project if it doesn't exist
        let projectId = await getProjectIDByName(projectName);
        if (!projectId) {
            console.log(`Project '${projectName}' does not exist. Creating new project`);
            
            const newProject: Partial<Project> = {
                projectName: projectName,
                clientApiKey: CLIENT_KEY,
                serverApiKey: SERVER_KEY,
                privateData: false,
                deletionPolicy: -1,
            };
            
            const createdProject = await createProject(newProject);
            projectId = createdProject._id;
            console.log(`Created new project with ID: ${projectId}`);
        } else {
            console.log(`Project ID found: ${projectId}`);
        }

        const { clickEvents, visitEvents, inputEvents, customEvents } = await fetchEvents();
        
        console.log(`Fetched ${clickEvents?.length} click events`)
        console.log(`Fetched ${visitEvents?.length} visit events`)
        console.log(`Fetched ${inputEvents?.length} input events`)
        console.log(`Fetched ${customEvents?.length} custom events`)

        for (const event of clickEvents || []) {
            await ClickEventModel.create({
                eventProperties: event.eventProperties,
                category: event.category,
                subcategory: event.subcategory,
                projectId: projectId,
                timestamp: event.createdAt ? new Date(event.createdAt) : new Date(),
            });
        }

        for (const event of visitEvents || []) {
            console.log(`event ${event}`)
            await VisitEventModel.create({
                eventProperties: event.eventProperties,
                category: event.category,
                subcategory: event.subcategory,
                projectId: projectId,
                timestamp: event.createdAt ? new Date(event.createdAt) : new Date(),
            });
        }

        for (const event of inputEvents || []) {
            await InputEventModel.create({
                eventProperties: event.eventProperties,
                category: event.category,
                subcategory: event.subcategory,
                projectId: projectId,
                timestamp: event.createdAt ? new Date(event.createdAt) : new Date(),
            });
        }

        for (const event of customEvents || []) {
            await CustomEventModel.create({
                eventTypeId: event.eventTypeId,
                environment: event.environment,
                properties: event.properties,
                projectId: projectId,
                timestamp: event.createdAt ? new Date(event.createdAt) : new Date(),
            });
        }
        console.log('Data exported');

    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        await mongoose.disconnect();
    }
}

async function fetchEvents() {
    try {
        const logger = new AnalyticsLogger({environment: EventEnvironment.PRODUCTION});
        await logger.authenticate(CLIENT_KEY)

        const manager = new AnalyticsManager({});
        await manager.authenticate(SERVER_KEY);

        const viewer = new AnalyticsViewer({ environment: EventEnvironment.PRODUCTION});
        await viewer.authenticate(SERVER_KEY);

        // Define a custom event if it doesn't already exist
        const existingCustomEventTypes = await viewer.getCustomEventTypes(projectName);

        const customEventExists = existingCustomEventTypes?.some(eventType => 
            eventType.category === "custom event category" && 
            eventType.subcategory === "custom event subcategory"
        );
        if (!customEventExists) {
            const customEventType = await manager.defineCustomEvent({
                category: "custom event category",
                subcategory: "custom event subcategory",
                properties: ["prop1"]
            });

            if (!customEventType) {
                console.error("Failed to define custom event");
            } else {
                console.log("Custom event defined:", customEventType);
            }
        }

        // Generate mock click, input, visit, and custom events
        for (let i = 0; i < 5; i++) {
            await logger.logClickEvent({ 
                objectId: `object-${i}`,                     
                userId: `user-${i}`,
            })
        }

        for (let i = 0; i < 5; i++) {
            await logger.logVisitEvent({                    
                pageUrl: `https://portal.analytics.bitsofgood.org/dashboard/page-${i}`,
                userId: `user-${i}`,
            })
        }

        for (let i = 0; i < 5; i++) {
            await logger.logInputEvent({                    
                objectId: `input-object-${i}`,
                userId: `user-${i}`,
                textValue: `Sample input value ${i}`,
            })
        }

        for (let i = 0; i < 5; i++) {
            await logger.logCustomEvent("custom event category", "custom event subcategory", {
                prop1: `val-${i}`
            })
        }

        const clickEvents = await viewer.getAllClickEvents(projectName);
        const visitEvents = await viewer.getAllVisitEvents(projectName);
        const inputEvents = await viewer.getAllInputEvents(projectName);
        const customEvents = await viewer.getAllCustomEvents(
            projectName,
            "custom event category",
            "custom event subcategory"
        );

        return {
            clickEvents,
            visitEvents,
            inputEvents,
            customEvents
        };
    } catch (error) {
        console.error('Failed to fetch events:', error);
        throw error;
    }
}

main().catch((error) => {
    console.error('Error:', error);
});
