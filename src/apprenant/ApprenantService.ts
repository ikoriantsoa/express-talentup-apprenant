import { AppDataSource } from "../config/database";
import { TalentApprenant } from "../entities/apprenant.entity";
import { ICreateApprenant } from "./interfaces/IcreateApprenant";

export class ApprenantService {
  private apprenantRepository = AppDataSource.getRepository(TalentApprenant);

  public async createApprenant(newApprenant: ICreateApprenant) {
    const cryptApprenant = {
      keycloakId: newApprenant.keycloakId,
      nom: newApprenant.nom,
      prenom: newApprenant.prenom,
      date_naissance: newApprenant.date_naissance,
      telephone: newApprenant.telephone,
      ville: newApprenant.ville,
      niveau_etude: newApprenant.niveau_etude,
      specialite: newApprenant.specialite,
      cv: newApprenant.cv,
      photo: newApprenant.photo,
      presentation: newApprenant.presentation,
      linkedin: newApprenant.linkedin,
      portfolio: newApprenant.portfolio,
    };

    const apprenant: TalentApprenant =
      this.apprenantRepository.create(cryptApprenant);

    const create = await this.apprenantRepository.save(apprenant);
    return create;
  }

  public async getAllApprenant() {
    const apprenants = await this.apprenantRepository.find();

    const decryptedApprenants = apprenants.map((appr) => ({
      keycloakId: appr.keycloakId,
      nom: appr.nom,
      prenom: appr.prenom,
      date_naissance: appr.date_naissance,
      telephone: appr.telephone,
      ville: appr.ville,
      niveau_etude: appr.niveau_etude,
      specialite: appr.specialite,
      cv: appr.cv,
      photo: appr.photo,
      presentation: appr.presentation,
      linkedin: appr.linkedin,
      portfolio: appr.portfolio,
    }));

    return decryptedApprenants;
  }

  public async getApprenantById(keycloakId: string) {
    const apprenant = await this.apprenantRepository.findOne({
      where: { keycloakId: keycloakId },
    });

    if (!apprenant) {
      throw new Error("Apprenant non trouvé");
    }

    return {
      keycloakId: apprenant.keycloakId,
      nom: apprenant.nom,
      prenom: apprenant.prenom,
      date_naissance: apprenant.date_naissance,
      telephone: apprenant.telephone,
      ville: apprenant.ville,
      niveau_etude: apprenant.niveau_etude,
      specialite: apprenant.specialite,
      cv: apprenant.cv!,
      photo: apprenant.photo!,
      presentation: apprenant.presentation,
      linkedin: apprenant.linkedin!,
      portfolio: apprenant.portfolio!,
    };
  }

  // public async updateApprenant(
  //   keycloakId: string,
  //   data: Partial<TalentApprenant>
  // ) {
  //   const apprenant = await this.apprenantRepository.findOne({
  //     where: { keycloakId: keycloakId },
  //   });

  //   if (!apprenant) {
  //     throw new Error("Apprenant non trouvé");
  //   }

  //   // Mettre à jour les champs nécessaires avec chiffrement si nécessaire
  //   if (data.username) {
  //     apprenant.username = this.cryptageService.encrypt(data.username);
  //   }
  //   if (data.email) {
  //     apprenant.email = this.cryptageService.encrypt(data.email);
  //   }
  //   if (data.firstname) {
  //     apprenant.firstname = this.cryptageService.encrypt(data.firstname);
  //   }
  //   if (data.lastname) {
  //     apprenant.lastname = this.cryptageService.encrypt(data.lastname);
  //   }
  //   if (data.adresse) {
  //     apprenant.adresse = this.cryptageService.encrypt(data.adresse);
  //   }

  //   // Sauvegarder les modifications dans la base de données
  //   return await this.apprenantRepository.save(apprenant);
  // }

  public async deleteApprenant(id: number) {}
}
