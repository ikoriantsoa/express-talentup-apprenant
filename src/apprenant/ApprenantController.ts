import { Request, Response } from "express";
import { ApprenantService } from "./ApprenantService";
import { ICreateApprenant } from "./interfaces/IcreateApprenant";

export class ApprenantController {

  public async getAllApprenant(req: Request, res: Response) {
    try {
      const apprenantService: ApprenantService = new ApprenantService();
      const result = await apprenantService.getAllApprenant();
      res.status(200).json(result);
      return;
    } catch (error) {
      res.status(500).json({
        message: `Erreur lors de la récupération de la liste des apprenants : ${error}`,
      });
      return;
    }
  }

  public async getApprenantById(req: Request, res: Response) {
    try {
      const { keycloakId } = req.params;
      const apprenantServie: ApprenantService = new ApprenantService();
      const result = await apprenantServie.getApprenantById(keycloakId);
      res.status(200).json(result);
      return;
    } catch (error) {
      res.status(500).json({
        message: `Erreur lors de la récupération d'un apprenant : ${error}`,
      });
      return;
    }
  }

  public async createApprenant(req: Request, res: Response): Promise<void> {
    try {
      const apprenant = req.body;
      
      const apprenantService: ApprenantService = new ApprenantService();
      
      const result = await apprenantService.createApprenant(apprenant.apprenant);
      console.log('result', result);
      
      res.status(201).json(result);
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Erreur lors de la création de l'apprenant" });
        console.log('error', error);
        
      return;
    }
  }

  // public async updateApprenant(req: Request, res: Response) {
    
  //   try {
  //     const { keycloakId } = req.params;
  //     const { lastname, firstname, adresse } = req.body;
  
  //     const apprenant = {
  //       lastname: lastname,
  //       firstname: firstname,
  //       adresse: adresse,
  //     };
  
  //     const apprenantService: ApprenantService = new ApprenantService();
  //     const result = await apprenantService.updateApprenant(
  //       keycloakId,
  //       apprenant
  //     );
  //     res.status(200).json(result);
  //     return;
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ error: "Erreur lors de la mise à jour de l'apprenant" });
  //     return;
  //   }
  // }
}
