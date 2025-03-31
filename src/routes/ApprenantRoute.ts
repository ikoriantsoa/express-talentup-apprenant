import { Router } from "express";
import { ApprenantController } from "../apprenant/ApprenantController";

const router: Router = Router();

const apprenantController: ApprenantController = new ApprenantController();

router.get('/allApprenant', apprenantController.getAllApprenant);
router.get('/apprenant/:keycloakId', apprenantController.getApprenantById);
router.post('/createApprenant', apprenantController.createApprenant);

export default router;
