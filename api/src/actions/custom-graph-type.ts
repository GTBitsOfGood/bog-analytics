import { dbConnect } from "@/src/utils/db-connect";
import CustomGraphTypeModel from "@/src/models/custom-graph-type";
import { CustomGraphType, GraphTypes } from "@/src/utils/types";
import CustomEventTypeModel from "@/src/models/custom-event-type";


export const createCustomGraphType = async (newGraph: Partial<CustomGraphType>) => {
    await dbConnect();
    let eventTypeId = newGraph.eventTypeId
    let eventType = await CustomEventTypeModel.findOne({ _id: eventTypeId, projectId: newGraph.projectId })
    if (!eventType) {
        return null;
    }
    const createdGraphType = await CustomGraphTypeModel.create(newGraph);
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

export const deleteAllCustomGraphTypes = async () => {
    await dbConnect();
    await CustomGraphTypeModel.deleteMany();
}