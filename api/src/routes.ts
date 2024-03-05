import { Router } from 'express';
import * as GeneralController from "@/src/controllers/general";
import * as EventController from "@/src/controllers/events"
import * as ProjectController from "@/src/controllers/project"
import * as GraphController from "@/src/controllers/graphs"
export const router = Router();

router.all('/health', GeneralController.health);

router.all('/events/click-event', EventController.clickEvent);
router.all('/events/input-event', EventController.inputEvent);
router.all('/events/visit-event', EventController.visitEvent);

router.all('/events/custom-event-type', EventController.customEventType);
router.all('/events/custom-event', EventController.customEvent);
router.all('/graphs/custom-graph-type', GraphController.customGraphType);

router.all('/project', ProjectController.project);