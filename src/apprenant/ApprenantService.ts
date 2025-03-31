import { AppDataSource } from "../config/database";
import { CryptageService } from "../cryptage/Cryptage";
import { ICryptage } from "../cryptage/ICryptage";
import { TalentApprenant } from "../entities/apprenant.entity";
import { ICreateApprenant } from "./interfaces/IcreateApprenant";

interface IData {
  keycloak_id: string;
  username: ICryptage;
  email: ICryptage;
  firstname: ICryptage;
  lastname: ICryptage;
  adresse: ICryptage;
}

export class ApprenantService {
  private apprenantRepository = AppDataSource.getRepository(TalentApprenant);
  private cryptageService = new CryptageService();

  public async createApprenant(newApprenant: ICreateApprenant) {

    const cryptApprenant = {
      keycloakId: newApprenant.keycloakId,
      username: this.cryptageService.encrypt(newApprenant.username),
      email: this.cryptageService.encrypt(newApprenant.email),
      firstname: this.cryptageService.encrypt(newApprenant.firstname),
      lastname: this.cryptageService.encrypt(newApprenant.lastname),
      adresse: this.cryptageService.encrypt(newApprenant.adresse),
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
      username: this.cryptageService.decrypt(appr.username),
      email: this.cryptageService.decrypt(appr.email),
      firstname: this.cryptageService.decrypt(appr.firstname),
      lastname: this.cryptageService.decrypt(appr.lastname),
      adresse: this.cryptageService.decrypt(appr.adresse),
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
      username: this.cryptageService.decrypt(apprenant.username),
      email: this.cryptageService.decrypt(apprenant.email),
      firstname: this.cryptageService.decrypt(apprenant.firstname),
      lastname: this.cryptageService.decrypt(apprenant.lastname),
      adresse: this.cryptageService.decrypt(apprenant.adresse),
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
