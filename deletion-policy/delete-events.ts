import mongoose from "mongoose";
import { ProjectModel, BaseEventModel, CustomEventModel } from "./models";

const MONGODB_URI = process.env.DATABASE_URL || "mongodb://localhost:27017";
const DATABASE_NAME = process.env.DATABASE_NAME || "bog-analytics";
const ONE_DAY = 24 * 60 * 60 * 1000;

async function dbConnect(): Promise<void> {
  if (mongoose.connections[0].readyState) return;
  await mongoose
    .connect(MONGODB_URI, {
      socketTimeoutMS: 360000,
      dbName: DATABASE_NAME,
    })
    .catch((error) => {
      console.error("Unable to connect to database.");
      throw error;
    });
}

async function deleteOldEvents(): Promise<number> {
  await dbConnect();

  const projects = await ProjectModel.find({});

  let totalDeleted = 0;

  for (const project of projects) {
    if (project.deletionPolicy > 0) {
      const cutoffDate = new Date(
        Date.now() - project.deletionPolicy * ONE_DAY
      );

      const baseEventResult = await BaseEventModel.deleteMany({
        projectId: project._id,
        createdAt: { $lt: cutoffDate },
      });

      const customEventResult = await CustomEventModel.deleteMany({
        projectId: project._id,
        createdAt: { $lt: cutoffDate },
      });

      const projectDeleted =
        baseEventResult.deletedCount + customEventResult.deletedCount;
      totalDeleted += projectDeleted;
      if (projectDeleted > 0) {
        console.log(
          `Deleted ${totalDeleted} events for project: ${project.projectName}`
        );
      } else {
        console.log(`No events to delete for project: ${project.projectName}`);
      }
    } else {
      console.log(
        `Skipping project: ${project.projectName} (deletionPolicy: ${project.deletionPolicy})`
      );
    }
  }

  return totalDeleted;
}

deleteOldEvents()
  .then((totalDeleted) => {
    console.log(`\nScript completed. Total deleted: ${totalDeleted} events.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("An error occurred:", error);
    process.exit(1);
  });
