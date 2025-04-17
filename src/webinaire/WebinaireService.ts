import { access } from "fs";
import { AppDataSource } from "../config/database";
import { TalentApprenant } from "../entities/apprenant.entity";
import { TalentupWebinaireControle } from "../entities/controle-webinaire.entity";
import { TalentupWebinaire } from "../entities/webinaire.entity";

interface ICreateWebinaire {
  keycloakId: string;
  titre: string;
  categorie: string;
  type: string;
  niveau: string;
  image: string;
  source: string;
  auteur: string;
}

interface WebinaireData {
  date?: Date;
  titre?: string;
  categorie?: string;
  image?: string;
  source?: string;
}

class WebinaireService {
  private webinaireRepository = AppDataSource.getRepository(TalentupWebinaire);
  private apprenantRepository = AppDataSource.getRepository(TalentApprenant);
  private controleWebinaireRepository = AppDataSource.getRepository(
    TalentupWebinaireControle
  );

  public async createWebinaire(newWebinaire: ICreateWebinaire) {
    const apprenant = await this.apprenantRepository.findOne({
      where: { keycloakId: newWebinaire.keycloakId },
    });

    if (!apprenant) {
      throw new Error(`Le compte apprenant n' existe pas`);
    }

    apprenant.partage = true;
    await this.apprenantRepository.save(apprenant);

    const webinaireNew = {
      titre: newWebinaire.titre,
      categorie: newWebinaire.categorie,
      image: newWebinaire.image,
      source: newWebinaire.source,
      apprenant: apprenant,
    };

    const talentWebinaire: TalentupWebinaire =
      this.webinaireRepository.create(webinaireNew);

    const create = await this.webinaireRepository.save(talentWebinaire);
    return create;
  }

  public async getWebinaireById(data: {
    webinaireId: string;
    keycloakId: string;
  }) {
    const { webinaireId, keycloakId } = data;

    try {
      // Vérifie l'existence de l'apprenant
      const apprenant = await this.apprenantRepository.findOne({
        where: { keycloakId },
      });

      if (!apprenant) {
        throw new Error("Apprenant inexistant!");
      }

      const sharing: boolean = apprenant.partage;

      const controleWebinaire = await this.controleWebinaireRepository.find({
        where: { webinaire_id: webinaireId, keycloak_id: keycloakId },
      });

      const webinaire = await this.webinaireRepository.findOne({
        where: { webinaireId },
      });

      if (!webinaire) {
        throw new Error("Webinaire introuvable");
      }

      const dataWebinaire: WebinaireData = {
        date: webinaire.updatedAt,
        titre: webinaire.titre,
        categorie: webinaire.categorie,
        image: webinaire.image,
        source: webinaire.source,
      };

      // Cas 1 : partage = true et aucun contrôle → on crée le contrôle
      if (sharing && controleWebinaire.length === 0) {
        const data = {
          keycloak_id: keycloakId,
          webinaire_id: webinaireId,
        };

        const newControle = this.controleWebinaireRepository.create(data);
        await this.controleWebinaireRepository.save(newControle);

        // Met à jour le partage de l'apprenant
        apprenant.partage = false;
        await this.apprenantRepository.save(apprenant);

        return {
          access: true,
          data: dataWebinaire,
        };
      }

      // Cas 2 : partage = true ou false et contrôle déjà existant
      if (controleWebinaire.length !== 0) {
        return {
          access: true,
          data: dataWebinaire,
        };
      }

      // Cas 3 : partage = false et aucun contrôle → accès refusé
      return {
        access: false,
        message: `Vous ne pouvez pas voir ce webinaire, partagez d'abord`,
      };
    } catch (error) {
      throw new Error(`Erreur dans getWebinaireById : ${error}`);
    }
  }

  public async getAllWebinaire() {
    const webinaires = await this.webinaireRepository.find({
      where: { status: true },
      relations: ["apprenant"],
    });

    const decryptWebinaire = webinaires.map((webinaire) => ({
      titre: webinaire.titre,
      categorie: webinaire.categorie,
      image: webinaire.image,
      source: webinaire.source,
      apprenant: webinaire.apprenant,
    }));

    return decryptWebinaire;
  }

  public async getRecentWebinaire() {
    const webinaires = await this.webinaireRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 10,
      where: {status: true},
      relations: ["apprenant"],
    });

    const decryptWebinaire = webinaires.map((webinaire) => ({
      titre: webinaire.titre,
      categorie: webinaire.categorie,
      image: webinaire.image,
      source: webinaire.source,
      apprenant: webinaire.apprenant,
    }));

    return decryptWebinaire;
  }
}

export default WebinaireService;
