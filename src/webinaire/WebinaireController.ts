import { Request, Response } from "express";
import WebinaireService from "./WebinaireService";

class WebinaireController {
  public async createWebinaire(req: Request, res: Response) {
    try {
      const webinaire = req.body;

      const webinaireService: WebinaireService = new WebinaireService();

      const result = await webinaireService.createWebinaire(
        webinaire.dataWebinaire
      );

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
      const { keycloakId, webinaireId } = req.params;
      const webinaireService: WebinaireService = new WebinaireService();
      const result = await webinaireService.getWebinaireById({
        keycloakId,
        webinaireId,
      });
      if (!result.access) {
        res.status(403).json({ message: result.message });
        return;
      }
      res.status(200).json(result);
      return;
    } catch (error) {
      res.status(500).json({
        message: `Erreur lors de la récupération d'un webinaire : ${error}`,
      });
      return;
    }
  }

  public async getAllWebinaires(req: Request, res: Response) {
    try {
      const webinaireService: WebinaireService = new WebinaireService();
      const result = await webinaireService.getAllWebinaire();
      res.status(200).json(result);
      return;
    } catch (error) {
      res.status(500).json({
        message: `Erreur lors de la récupération de la liste des webinaires : ${error}`,
      });
      return;
    }
  }

  public async getRecentWebinaires(req: Request, res: Response) {
    try {
      const webinaireService: WebinaireService = new WebinaireService();
      const result = await webinaireService.getRecentWebinaire();
      res.status(200).json(result);
      return;
    } catch (error) {
      res.status(500).json({
        message: `Erreur lors de la récupération de la liste des webinaires les plus récents: ${error}`,
      });
      return;
    }
  }
}

export default WebinaireController;
