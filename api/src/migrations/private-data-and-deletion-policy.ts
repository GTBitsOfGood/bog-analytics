import { dbConnect } from "@/src/utils/db-connect";
import dotenv from 'dotenv';
import ProjectModel from "@/src/models/project";

export async function updateProjectPrivateDataAndDeletionPolicy(productionMode: boolean) {
    if (productionMode) {
        dotenv.config({ path: '../../.env.prod' })
    } else {
        dotenv.config({ path: '../../.env' })

    }
    await dbConnect();

    const projects = await ProjectModel.find({})

    console.log("Updating Projects")
    for (let project of projects) {
        if (!project.deletionPolicy) {
            project.deletionPolicy = -1
        }
        if (!project.privateData) {
            project.privateData = false;
        }
        await project.save();
    }

    return
}