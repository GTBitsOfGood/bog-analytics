import { afterAll, beforeAll, describe, expect, test, afterEach } from '@jest/globals';
import request, { Test } from "supertest";
import { api } from "@/netlify/functions/api";
import { Project } from '@/src/utils/types';
import { deleteProjectById } from '@/src/actions/project';
import { Server, IncomingMessage, ServerResponse, get } from 'http';
import TestAgent from 'supertest/lib/agent';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { deleteAllCustomEventTypes, getCustomEventType, getCustomEventTypeID, getCustomEventTypesForProject, } from '@/src/actions/custom-event-type';
import { getCustomEventsByProjectId, getCustomEventsByEventTypeId, deleteCustomEvents } from '@/src/actions/custom-event';
import { CustomEventType } from '@/src/utils/types';
import { deleteAllCustomGraphTypes, deleteCustomGraphType, getCustomGraphTypes } from '@/src/actions/custom-graph-type';

let manyTypesProject: Project | null = null;
let colorProject: Project | null = null;
let unchangedProject: Project | null = null;
let manyColorType: CustomEventType | null = null;
let manyDimType: CustomEventType | null = null;
let oneColorType: CustomEventType | null = null;


let server: Server<typeof IncomingMessage, typeof ServerResponse>;
let agent: TestAgent<Test>;
let mongoMemoryInstance: MongoMemoryServer;
beforeAll(async () => {
    mongoMemoryInstance = await MongoMemoryServer.create();
    process.env.DATABASE_URL = mongoMemoryInstance.getUri();
    server = api.listen(944)
    agent = request.agent(server)
})

afterAll(async () => {
    await mongoMemoryInstance.stop()
    server.close()
})

describe("/api/events/custom-event", () => {
    beforeAll(async () => {
        const eventTypeDimProperties = {
            category: "Interaction",
            subcategory: "Resize",
            properties: ["length", "width", "height"]
        }
        const eventTypeColorProperties = {

            category: "Image",
            subcategory: "Visuals",
            properties: ["color", "pixels", "opacity"]
        }
        //project with color and dimension custom event types
        const response = await agent.post("/api/project").send({ projectName: "many types project" })
        expect(response.status).toBe(200)
        manyTypesProject = response.body.payload;
        const colorEventTypeResponse = await agent
            .post("/api/events/custom-event-type")
            .set("servertoken", manyTypesProject?.serverApiKey as string)
            .send(eventTypeColorProperties);
        expect(colorEventTypeResponse.status).toBe(200);
        const dimEventTypeResponse = await agent
            .post("/api/events/custom-event-type")
            .set("servertoken", manyTypesProject?.serverApiKey as string)
            .send(eventTypeDimProperties);
        expect(dimEventTypeResponse.status).toBe(200);
        const eventTypes = await getCustomEventTypesForProject(manyTypesProject?._id as string);
        expect(eventTypes.length).toEqual(2);

        manyColorType = colorEventTypeResponse.body.payload;
        manyDimType = dimEventTypeResponse.body.payload;
        //project with no custom event types
        const response2 = await agent.post("/api/project").send({ projectName: "unchanged project" })
        unchangedProject = response2.body.payload;
        expect(response2.status).toBe(200);
        const eventTypes2 = await getCustomEventTypesForProject(unchangedProject?._id as string);
        expect(eventTypes2.length).toEqual(0);

        //project with only color custom event type
        const response3 = await agent.post("/api/project").send({ projectName: "color project" })
        colorProject = response3.body.payload;
        const colorResponse = await agent
            .post("/api/events/custom-event-type")
            .set("servertoken", colorProject?.serverApiKey as string)
            .send(eventTypeColorProperties);
        expect(colorResponse.status).toBe(200);
        const eventTypes3 = await getCustomEventTypesForProject(colorProject?._id as string);
        expect(eventTypes3.length).toEqual(1);
        oneColorType = colorResponse.body.payload;

    })
    afterAll(async () => {
        await deleteProjectById(manyTypesProject?._id as string);
        await deleteProjectById(colorProject?._id as string);
        await deleteProjectById(unchangedProject?._id as string);
        await deleteAllCustomEventTypes();
    });

    describe("POST /api/events/custom-event", () => {

        const captionedGraph = {
            graphTitle: "Captioned Graph",
            xProperty: "time",
            yProperty: "viewers",
            graphType: "bar",
            caption: "This is a caption",
        }
        const uncaptionedGraph = {
            graphTitle: "Captioned Graph",
            xProperty: "time",
            yProperty: "viewers",
            graphType: "bar",
            caption: "This is a caption"
        }


        afterEach(async () => {
            // Clean up custom event types events
            await deleteAllCustomGraphTypes();
        })
        test("Create new custom graph type with a valid server key", async () => {
            const response = await agent
                .post("/api/graphs/custom-graph-type")
                .set("servertoken", manyTypesProject?.serverApiKey as string)
                .send({ ...captionedGraph, eventTypeId: manyColorType?._id });
            expect(response.status).toBe(200);

            const graphs = await getCustomGraphTypes(manyColorType?._id as string, manyTypesProject?._id as string,);
            expect(graphs.length).toEqual(1);
        });
        test("Create new custom graph type with invalid server token", async () => {
            const response = await agent
                .post("/api/events/custom-event")
                .set("servertoken", "invalid  token")
                .send();
            expect(response.status).toBe(403);

            const events = await getCustomGraphTypes(manyColorType?._id as string, manyTypesProject?._id as string,);
            expect(events.length).toEqual(0);
        });
        test("Create new custom graph type with a valid server key", async () => {
            const response = await agent
                .post("/api/graphs/custom-graph-type")
                .set("servertoken", manyTypesProject?.serverApiKey as string)
                .send({ ...uncaptionedGraph, eventTypeId: manyColorType?._id });
            expect(response.status).toBe(200);

            const graphs = await getCustomGraphTypes(manyColorType?._id as string, manyTypesProject?._id as string,);
            expect(graphs.length).toEqual(1);
        });
        test("Create custom graph type with invalid properties", async () => {
            const response = await agent
                .post("/api/graphs/custom-graph-type")
                .set("servertoken", manyTypesProject?.serverApiKey as string)
                .send({
                    eventTypeId: manyColorType?._id,
                    graphTitle: "Uncaptioned Graph",
                });
            expect(response.status).toBe(400);

            const events = await getCustomGraphTypes(manyColorType?._id as string, manyTypesProject?._id as string,);
            expect(events.length).toEqual(0);
        });
        test("Create custom graph types with event types in different projects", async () => {
            const response = await agent
                .post("/api/graphs/custom-graph-type")
                .set("servertoken", manyTypesProject?.serverApiKey as string)
                .send({
                    eventTypeId: oneColorType?._id,
                    ...captionedGraph
                });
            expect(response.status).toBe(400);

            const events = await getCustomGraphTypes(oneColorType?._id as string, manyTypesProject?._id as string,);
            expect(events.length).toEqual(0);
            const events2 = await getCustomGraphTypes(manyColorType?._id as string, manyTypesProject?._id as string,);
            expect(events2.length).toEqual(0);
        });
        test("Create multiple custom graph types for one project", async () => {
            const response = await agent
                .post("/api/graphs/custom-graph-type")
                .set("servertoken", colorProject?.serverApiKey as string)
                .send({
                    eventTypeId: oneColorType?._id,
                    ...captionedGraph
                });
            expect(response.status).toBe(200);

            const events = await getCustomGraphTypes(oneColorType?._id as string, colorProject?._id as string,);
            expect(events.length).toEqual(1);
            const response2 = await agent
                .post("/api/graphs/custom-graph-type")
                .set("servertoken", colorProject?.serverApiKey as string)
                .send({
                    eventTypeId: oneColorType?._id,
                    ...uncaptionedGraph
                });
            expect(response2.status).toBe(200);

            const events2 = await getCustomGraphTypes(oneColorType?._id as string, colorProject?._id as string,);
            expect(events2.length).toEqual(2);
        });

        test("Create custom graph type with invalid properties", async () => {
            const response = await agent
                .post("/api/graphs/custom-graph-type")
                .set("servertoken", manyTypesProject?.serverApiKey as string)
                .send({
                    eventTypeId: manyColorType?._id,
                    graphTitle: "Uncaptioned Graph",
                });
            expect(response.status).toBe(400);

            const response2 = await agent
                .post("/api/graphs/custom-graph-type")
                .set("servertoken", manyTypesProject?.serverApiKey as string)
                .send({
                    eventTypeId: manyColorType?._id,
                    ...uncaptionedGraph
                });
            expect(response2.status).toBe(200);

            const events = await getCustomGraphTypes(manyColorType?._id as string, manyTypesProject?._id as string,);
            expect(events.length).toEqual(1);
        });
    });
});
