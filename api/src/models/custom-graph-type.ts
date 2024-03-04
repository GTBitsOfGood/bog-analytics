import mongoose, { Schema } from "mongoose";
import { CustomGraphType } from "@/src/utils/types";
import ProjectModel from "@/src/models/project";
import CustomEventTypeModel from "@/src/models/custom-event-type";

export const CustomEventSchema = new mongoose.Schema<CustomEvent>({
    subcategory: {
        type: String,
        required: true,
    },
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
    mongoose.model<CustomGraphType>("CustomGraphType", CustomGraphType);

export default CustomGraphTypeModel;