import { Router } from 'express';
import * as GeneralController from "@/src/controllers/general";
import * as EventController from "@/src/controllers/events"
import * as ProjectController from "@/src/controllers/project"
export const router = Router();

router.all('/health', GeneralController.health);
router.all('/events/click-event', EventController.clickEvent);
router.get('/events/click-events', EventController.paginatedClickEvents)

router.all('/events/input-event', EventController.inputEvent);
router.get('/events/input-events', EventController.paginatedInputEvents)


router.all('/events/visit-event', EventController.visitEvent);
router.get('/events/visit-events', EventController.paginatedVisitEvents)

router.all('/projects', ProjectController.project);