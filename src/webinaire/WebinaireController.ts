import { Request, Response } from "express";
import WebinaireService from "./WebinaireService";

class WebinaireController {
  public async createWebinaire(req: Request, res: Response) {
    try {
      const webinaire = req.body;

      const webinaireService: WebinaireService = new WebinaireService();

      const result = await webinaireService.createWebinaire(webinaire.dataWebinaire);

      res.status(201).json(result);
      return;
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la création de l'apprenant" });
      console.log("error", error);

      return;
    }
  }

  public async getWebinaireById(req: Request, res: Response) {
    try {
        const {keycloakId, webinaireId} = req.params;
        const webinaireService: WebinaireService = new WebinaireService();
        const result = await webinaireService.getWebinaireById({keycloakId, webinaireId});
        res.status(200).json(result);
        return;
    } catch (error) {
        res.status(500).json({
            message: `Erreur lors de la récupération d'un webinaire : ${error}`,
          });
    }
  }
}

export default WebinaireController;
