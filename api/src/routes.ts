import { Router } from 'express';
import * as GeneralController from "@/src/controllers/general";
import * as EventController from "@/src/controllers/events"
import * as ProjectController from "@/src/controllers/project"
import * as GraphController from "@/src/controllers/graphs"
import * as GDPRController from "@/src/controllers/gdpr";
import * as PortalController from "@/src/controllers/portal";

export const router = Router();

router.all('/health', GeneralController.health);

router.all('/events/click-event', EventController.clickEvent);
router.all('/events/input-event', EventController.inputEvent);
router.all('/events/visit-event', EventController.visitEvent);

router.all('/events/custom-event-type', EventController.customEventType);
router.all('/events/custom-event', EventController.customEvent);
router.all('/graphs/custom-graph-type', GraphController.customGraphType);

router.all('/gdpr/click-event', GDPRController.gdprClickEvent);
router.all('/gdpr/visit-event', GDPRController.gdprVisitEvent);
router.all('/gdpr/input-event', GDPRController.gdprInputEvent);
router.all('/gdpr/custom-event', GDPRController.gdprCustomEvent);

router.all('/portal/project', PortalController.portalProject);


router.all('/project', ProjectController.project);