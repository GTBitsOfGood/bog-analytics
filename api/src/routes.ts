import { Router } from 'express';
import * as GeneralController from "@/src/controllers/general";

export const router = Router();

router.get('/health', GeneralController.health)