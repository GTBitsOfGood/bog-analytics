import { Router } from 'express';
import * as GeneralController from "@/src/controllers/general";
import * as EventController from "@/src/controllers/events"
import * as ProjectController from "@/src/controllers/project"
export const router = Router();

router.all('/health', GeneralController.health);
router.all('/events/click-event', EventController.clickEvent);
router.all('/events/click-events', EventController.clickEvent)

router.all('/events/input-event', EventController.inputEvent);
router.all('/events/input-events', EventController.paginatedInputEvents)


router.all('/events/visit-event', EventController.visitEvent);
router.all('/events/visit-events', EventController.paginatedVisitEvents)

router.all('/projects', ProjectController.project);