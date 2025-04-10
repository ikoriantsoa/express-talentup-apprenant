import { AppDataSource } from "../config/database";
import { CryptageService } from "../cryptage/Cryptage";
import { TalentApprenant } from "../entities/apprenant.entity";
import { ICreateApprenant } from "./interfaces/IcreateApprenant";

export class ApprenantService {
  private apprenantRepository = AppDataSource.getRepository(TalentApprenant);
  private cryptageService = new CryptageService();

  public async createApprenant(newApprenant: ICreateApprenant) {
    const cryptApprenant = {
      keycloakId: newApprenant.keycloakId,
      nom: this.cryptageService.encrypt(newApprenant.nom),
      prenom: this.cryptageService.encrypt(newApprenant.prenom),
      date_naissance: this.cryptageService.encrypt(newApprenant.date_naissance),
      telephone: this.cryptageService.encrypt(newApprenant.telephone),
      ville: this.cryptageService.encrypt(newApprenant.ville),
      niveau_etude: this.cryptageService.encrypt(newApprenant.niveau_etude),
      specialite: this.cryptageService.encrypt(newApprenant.specialite),
      cv: this.cryptageService.encrypt(newApprenant.cv),
      photo: this.cryptageService.encrypt(newApprenant.photo),
      presentation: this.cryptageService.encrypt(newApprenant.presentation),
      linkedin: this.cryptageService.encrypt(newApprenant.linkedin),
      portfolio: this.cryptageService.encrypt(newApprenant.portfolio),
      //objectives: newApprenant.objectives,
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
      nom: this.cryptageService.decrypt(appr.nom),
      prenom: this.cryptageService.decrypt(appr.prenom),
      date_naissance: this.cryptageService.decrypt(appr.date_naissance),
      telephone: this.cryptageService.decrypt(appr.telephone),
      ville: this.cryptageService.decrypt(appr.ville),
      niveau_etude: this.cryptageService.decrypt(appr.niveau_etude),
      specialite: this.cryptageService.decrypt(appr.specialite),
      cv: this.cryptageService.decrypt(appr.cv!),
      photo: this.cryptageService.decrypt(appr.photo!),
      presentation: this.cryptageService.decrypt(appr.presentation),
      linkedin: this.cryptageService.decrypt(appr.linkedin!),
      portfolio: this.cryptageService.decrypt(appr.portfolio!),
      objectives: appr.objectives,
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
      nom: this.cryptageService.decrypt(apprenant.nom),
      prenom: this.cryptageService.decrypt(apprenant.prenom),
      date_naissance: this.cryptageService.decrypt(apprenant.date_naissance),
      telephone: this.cryptageService.decrypt(apprenant.telephone),
      ville: this.cryptageService.decrypt(apprenant.ville),
      niveau_etude: this.cryptageService.decrypt(apprenant.niveau_etude),
      specialite: this.cryptageService.decrypt(apprenant.specialite),
      cv: this.cryptageService.decrypt(apprenant.cv!),
      photo: this.cryptageService.decrypt(apprenant.photo!),
      presentation: this.cryptageService.decrypt(apprenant.presentation),
      linkedin: this.cryptageService.decrypt(apprenant.linkedin!),
      portfolio: this.cryptageService.decrypt(apprenant.portfolio!),
      objectives: apprenant.objectives,
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
