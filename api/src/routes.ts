import { Router } from 'express';
import * as GeneralController from "@/controllers/general";

export const router = Router();

router.get('/health', GeneralController.health)