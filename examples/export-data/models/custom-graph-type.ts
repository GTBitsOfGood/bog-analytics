import mongoose, { Schema } from "mongoose";
import { CustomGraphType } from "../utils/types";
import ProjectModel from "./project";
import CustomEventTypeModel from "./custom-event-type";

export const CustomGraphTypeSchema = new mongoose.Schema<CustomGraphType>({
    projectId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: ProjectModel.modelName
    },
    eventTypeId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: CustomEventTypeModel.modelName
    },
    graphTitle: {
        type: String,
        required: true
    },
    xProperty: {
        type: String,
        required: true
    },
    yProperty: {
        type: String,
        required: true
    },
    graphType: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: false
    },
});

const CustomGraphTypeModel =
    (mongoose.models.CustomGraphType as mongoose.Model<CustomGraphType>) ||
    mongoose.model<CustomGraphType>("CustomGraphType", CustomGraphTypeSchema);

export default CustomGraphTypeModel;