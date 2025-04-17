import { Router } from "express";
import WebinaireController from "../webinaire/WebinaireController";

const router: Router = Router();

const webinaireController: WebinaireController = new WebinaireController();

router.post('/createWebinaire', webinaireController.createWebinaire);
router.get('/getWebinaire/:keycloakId/:webinaireId', webinaireController.getWebinaireById);
router.get('/allWebinaire', webinaireController.getAllWebinaires);
router.get('/recentWebinaire', webinaireController.getRecentWebinaires);

export default router;
