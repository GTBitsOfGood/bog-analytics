import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dbConnect } from './utils/db-connect';
import { AnalyticsViewer, AnalyticsLogger, AnalyticsManager, EventEnvironment } from "bog-analytics";
import { ClickEventModel } from './models/click-event';
import { VisitEventModel } from './models/visit-event';
import { InputEventModel } from './models/input-event';
import { CustomEventModel } from './models/custom-event';
import CustomEventTypeModel from './models/custom-event-type';

dotenv.config();
const CLIENT_KEY = process.env.CLIENT_API_KEY || '';
const SERVER_KEY = process.env.SERVER_API_KEY || '';
const projectName = "Bits of Good Example Project";

const main = async () => {
    try {
        await dbConnect();
        console.log('Connected to MongoDB');

        const viewer = new AnalyticsViewer({ environment: EventEnvironment.PRODUCTION });
        await viewer.authenticate(SERVER_KEY); // Only necessary for private data

        const customEventTypes = await viewer.getCustomEventTypes(projectName);
        if (customEventTypes) {
            for (const eventType of customEventTypes) {
                const existingType = await CustomEventTypeModel.findById(eventType._id);
                if (!existingType) {
                    await CustomEventTypeModel.create({
                        _id: eventType._id,
                        category: eventType.category,
                        subcategory: eventType.subcategory,
                        properties: eventType.properties,
                    });
                }
            }
            console.log(`Exported ${customEventTypes.length} custom event types`);
        }

        // Gets the most recent createdAt date for each event type
        const afterDate = await getLatestEventDates();

        let clickEvents = await viewer.getAllClickEvents(projectName, afterDate.click);
        let visitEvents = await viewer.getAllVisitEvents(projectName, afterDate.visit);
        let inputEvents = await viewer.getAllInputEvents(projectName, afterDate.input);
        let customEvents = await viewer.getAllCustomEvents(
            projectName,
            "custom event category",
            "custom event subcategory",
            afterDate.custom
        );

        // If no existing events, mock the data
        if (isEmptyEvents(clickEvents, visitEvents, inputEvents, customEvents)) {
            const mockData = await mockEvents();
            clickEvents = mockData.clickEvents;
            visitEvents = mockData.visitEvents;
            inputEvents = mockData.inputEvents;
            customEvents = mockData.customEvents;
        }

        console.log(`Fetched ${clickEvents?.length} click events`)
        console.log(`Fetched ${visitEvents?.length} visit events`)
        console.log(`Fetched ${inputEvents?.length} input events`)
        console.log(`Fetched ${customEvents?.length} custom events`)

        // Export analytics data to database
        for (const event of clickEvents || []) {
            await ClickEventModel.create({
                eventProperties: event.eventProperties,
                category: event.category,
                subcategory: event.subcategory,
                createdAt: event.createdAt ? new Date(event.createdAt) : new Date(),
                updatedAt: event.updatedAt ? new Date(event.updatedAt) : new Date(),
            });
        }

        for (const event of visitEvents || []) {
            await VisitEventModel.create({
                eventProperties: event.eventProperties,
                category: event.category,
                subcategory: event.subcategory,
                createdAt: event.createdAt ? new Date(event.createdAt) : new Date(),
                updatedAt: event.updatedAt ? new Date(event.updatedAt) : new Date(),
            });
        }

        for (const event of inputEvents || []) {
            await InputEventModel.create({
                eventProperties: event.eventProperties,
                category: event.category,
                subcategory: event.subcategory,
                createdAt: event.createdAt ? new Date(event.createdAt) : new Date(),
                updatedAt: event.updatedAt ? new Date(event.updatedAt) : new Date(),
            });
        }

        for (const event of customEvents || []) {
            await CustomEventModel.create({
                eventTypeId: event.eventTypeId,
                environment: event.environment,
                properties: event.properties,
                createdAt: event.createdAt ? new Date(event.createdAt) : new Date(),
                updatedAt: event.updatedAt ? new Date(event.updatedAt) : new Date(),
            });
        }
        console.log('Data exported');

    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        await mongoose.disconnect();
    }
}

function isEmptyEvents(...events: Array<any[] | null>): boolean {
    return events.every(eventList => !eventList || eventList.length === 0);
}

async function getLatestEventDates() {
    const latestClickEvent = await ClickEventModel.findOne().sort({ createdAt: -1 });
    const latestVisitEvent = await VisitEventModel.findOne().sort({ createdAt: -1 });
    const latestInputEvent = await InputEventModel.findOne().sort({ createdAt: -1 });
    const latestCustomEvent = await CustomEventModel.findOne().sort({ createdAt: -1 });

    return {
        click: latestClickEvent?.createdAt ? new Date(latestClickEvent.createdAt) : undefined,
        visit: latestVisitEvent?.createdAt ? new Date(latestVisitEvent.createdAt) : undefined,
        input: latestInputEvent?.createdAt ? new Date(latestInputEvent.createdAt) : undefined,
        custom: latestCustomEvent?.createdAt ? new Date(latestCustomEvent.createdAt) : undefined,
    };
}
async function mockEvents() {
    try {
        const logger = new AnalyticsLogger({ environment: EventEnvironment.PRODUCTION });
        await logger.authenticate(CLIENT_KEY)

        const manager = new AnalyticsManager({});
        await manager.authenticate(SERVER_KEY);

        const viewer = new AnalyticsViewer({ environment: EventEnvironment.PRODUCTION });
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
