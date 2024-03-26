import { dbConnect } from "@/src/utils/db-connect";
import CustomGraphTypeModel from "@/src/models/custom-graph-type";
import { CustomGraphType, GraphTypes } from "@/src/utils/types";
import CustomEventTypeModel from "@/src/models/custom-event-type";


export const createCustomGraphType = async (newGraph: Partial<CustomGraphType>) => {
    await dbConnect();
    let eventTypeId = newGraph.eventTypeId
    let eventType = await CustomEventTypeModel.findOne({ _id: eventTypeId })
    console.log("HEREE 1")
    if (!eventType) {
        return null;
    }
    console.log("HEREE 2")
    let typeProperties = eventType.properties;
    if (!typeProperties.includes(newGraph.xProperty as string) || !typeProperties.includes(newGraph.yProperty as string)) {
        return null;
    }
    console.log("HEREE 3")
    if (!Object.values(GraphTypes).includes(newGraph.graphType as GraphTypes)) {
        return null;
    }
    console.log("HEREE 4", newGraph)
    const createdGraphType = await CustomGraphTypeModel.create(newGraph);
    console.log("INNER HERE 4", createdGraphType)
    return createdGraphType;
}

export const getCustomGraphTypes = async (eventTypeId: string, projectId: string) => {
    await dbConnect();
    const graphTypes = await CustomGraphTypeModel.find({ eventTypeId, projectId })
    return graphTypes
}
export const deleteCustomGraphType = async (_id: string) => {
    await dbConnect();
    const deletedGraphType = await CustomGraphTypeModel.deleteOne({ _id })
    return deletedGraphType
}