import APIWrapper from "server/utils/APIWrapper";
import { APIWrapperType, Role } from "@/utils/types"
import { getProject } from "server/mongodb/actions/Project";
import { NextRequest } from "next/server";
import { AnalyticsViewer, EventEnvironment } from "bog-analytics";
import { urls } from "@/utils/urls";

const route: APIWrapperType = APIWrapper({
    GET: {
        config: {
            requiredVerifiedUser: true,
            roles: [Role.MEMBER]
        },
        handler: async (req: NextRequest) => {
            const projectId = req.nextUrl.searchParams.get('projectId');
            if (!projectId) {
                throw new Error("You must specify a project id")
            }
            const project = await getProject(projectId as string);
            const analyticsViewer = new AnalyticsViewer({ apiBaseUrl: urls.analyticsUrl, environment: process.env.NODE_ENV === "production" ? EventEnvironment.PRODUCTION : EventEnvironment.DEVELOPMENT })
            const eventTypes = await analyticsViewer.getCustomEventTypes(project.projectName)
            return eventTypes
        },
    },
});

export let GET: APIWrapperType, POST: APIWrapperType, PATCH: APIWrapperType, DELETE: APIWrapperType, PUT: APIWrapperType;
GET = POST = PATCH = POST = DELETE = PUT = route;