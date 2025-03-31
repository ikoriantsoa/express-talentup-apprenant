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

class WebinaireService {
  private webinaireRepository = AppDataSource.getRepository(TalentupWebinaire);
  private apprenantRepository = AppDataSource.getRepository(TalentApprenant);
  private controleWebinaireRepository = AppDataSource.getRepository(TalentupWebinaireControle);

  public async createWebinaire(newWebinaire: ICreateWebinaire) {
    const webinaire = {
      titre: newWebinaire.titre,
      categorie: newWebinaire.categorie,
      type: newWebinaire.type,
      niveau: newWebinaire.niveau,
      image: newWebinaire.image,
      source: newWebinaire.source,
      auteur: newWebinaire.auteur,
    };

    const apprenant = await this.apprenantRepository.findOne({
      where: { keycloakId: newWebinaire.keycloakId },
    });

    if (!apprenant) {
      throw new Error(`Le compte apprenant n' existe pas`);
    }

    apprenant.partage = true;
    await this.apprenantRepository.save(apprenant);

    const talentWebinaire: TalentupWebinaire =
      this.webinaireRepository.create(webinaire);

    const create = await this.webinaireRepository.save(talentWebinaire);
    return create;
  }

  public async getWebinaireById(data: {
    webinaireId: string;
    keycloakId: string;
  }) {

    try {
    const { webinaireId, keycloakId } = data;

    try {
      // Vérifie l'id keycloak de l'apprenant
      const apprenant = await this.apprenantRepository.findOne({
        where: { keycloakId: keycloakId },
      });

      if (!apprenant) {
        throw new Error('Apprenant inexistant!');
      }

      // Prend le status de partage de l'apprenant
      const sharing: boolean = apprenant.partage;

      // Regarde si le controle du webinaire existe déjà
      const controleWebinaire = await this.controleWebinaireRepository.find({
        where: { webinaire_id: webinaireId, keycloak_id: keycloakId },
      });

      const webinaire = await this.webinaireRepository.findOne({
        where: { webinaireid: webinaireId },
      });

      // Si le partage est true et le controleWebinaire est vide
      if (sharing && controleWebinaire.length === 0) {
        const data = {
          keycloak_id: keycloakId,
          webinaire_id: webinaireId,
        };

        const dataControle = this.controleWebinaireRepository.create(data);
        await this.controleWebinaireRepository.save(dataControle);

        apprenant.partage = false;
        this.apprenantRepository.save(apprenant);

        const dataWebinaire = {
          date: webinaire?.updatedAt,
          titre: webinaire?.titre,
          categorie: webinaire?.categorie,
          type: webinaire?.type,
          niveau: webinaire?.niveau,
          image: webinaire?.image,
          source: webinaire?.source,
        };

        return dataWebinaire;
      }

      // Si le partage est true et le controleWebinaire n'est pas vide
      if (sharing && controleWebinaire.length !== 0) {
        const dataWebinaire = {
          date: webinaire?.updatedAt,
          titre: webinaire?.titre,
          categorie: webinaire?.categorie,
          type: webinaire?.type,
          niveau: webinaire?.niveau,
          image: webinaire?.image,
          source: webinaire?.source,
        };

        return dataWebinaire;
      }

      // Si le partage est false et le controleWebinaire n'est pas vide
      if (!sharing && controleWebinaire.length !== 0) {
        const dataWebinaire = {
          date: webinaire?.updatedAt,
          titre: webinaire?.titre,
          categorie: webinaire?.categorie,
          type: webinaire?.type,
          niveau: webinaire?.niveau,
          image: webinaire?.image,
          source: webinaire?.source,
        };

        return dataWebinaire;
      }

      // Si le partage est false et le controleWebinaire est vide
      if (!sharing && controleWebinaire.length === 0) {
        throw new Error(
          `Vous ne pouvez pas voir ce webinaire, partager d'abord`,
        );
      }
    } catch (error) {
        throw new Error(`Erreur dans getWebinaireById : ${error}`);
    }
    
  } catch (error) {
    throw new Error(`Une erreur est survenue lors de la récupération du webinaire ${error}`);
  }
}
}

export default WebinaireService;