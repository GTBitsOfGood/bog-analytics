import APIWrapper from "server/utils/APIWrapper";
import { APIWrapperType, Role } from "@/utils/types"
import { NextRequest } from "next/server";
import { EventEnvironment } from "bog-analytics";
import { getCustomEventCount } from "server/mongodb/actions/CustomEvent";

const route: APIWrapperType = APIWrapper({
    GET: {
        config: {
            requiredVerifiedUser: true,
            roles: [Role.MEMBER]
        },
        handler: async (req: NextRequest) => {
            const subcategory = req.nextUrl.searchParams.get('subcategory');
            const category = req.nextUrl.searchParams.get('category');

            if (!category || !subcategory) {
                throw new Error("You must specify an event category and subcategory");
            }
            const projectId = req.nextUrl.searchParams.get('projectId');
            const afterDate = req.nextUrl.searchParams.get('afterDate');
            const environment = req.nextUrl.searchParams.get('environment');

            return getCustomEventCount(category as string, subcategory, new Date(afterDate as string), environment as EventEnvironment, projectId as string);
        },
    },
});

export let GET: APIWrapperType, POST: APIWrapperType, PATCH: APIWrapperType, DELETE: APIWrapperType, PUT: APIWrapperType;
GET = POST = PATCH = POST = DELETE = PUT = route;