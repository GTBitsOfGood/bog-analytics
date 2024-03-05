import { dbConnect } from "@/src/utils/db-connect";
import CustomGraphTypeModel from "@/src/models/custom-event-type";
import { CustomGraphType } from "@/src/utils/types";


export const createCustomGraphType = async (newGraph: Partial<CustomGraphType>) => {
    await dbConnect();
    let eventTypeId = newGraph.eventTypeId
    let eventType = CustomGraphTypeModel.find({ _id: eventTypeId })
    if (eventType == null) {
        //there is no event with this id for this projectId
        return;
    }
    let typeProperties = eventType.properties
    if (!typeProperties.includes("xProperty") || !typeProperties.includes("yProperty")) {
        //Checks if all the properties in event type are in the custom even properties
        return;
    }
    let type = newGraph.graphType
    if (type != "bar" && type != "line" && type != "scatter") {
        //graphType is not bar, line, or scatter
        return;
    }
    const createdGraphType = await CustomGraphTypeModel.create(newGraph);
    return createdGraphType;
}

export const getCustomGraphTypes = async (eventTypeId: string, projectId: string) => {
    await dbConnect();
    const graphTypes = await CustomGraphTypeModel.find({ eventTypeId, projectId})
    return graphTypes
}
export const deleteCustomGraphType = async (_id: string) => {
    await dbConnect();
    const deletedGraphType = await CustomGraphTypeModel.deleteOne({_id})
    return deletedGraphType
}