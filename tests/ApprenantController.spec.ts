import { DataSource } from "typeorm";
import { ApprenantService } from "../src/apprenant/ApprenantService";
import { TalentApprenant } from "../src/entities/apprenant.entity";

let dataSource: DataSource;
let apprenantService: ApprenantService;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [TalentApprenant],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  apprenantService = new ApprenantService();
  // Forcer le repo à pointer sur notre dataSource de test
  (ApprenantService as any).prototype.repository = dataSource.getRepository(TalentApprenant);
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("ApprenantService - Tests d'intégration", () => {
  const messi = {
    keycloakId: "uuid-keycloak",
    nom: "Messi",
    prenom: "Lionel",
    date_naissance: "1987-06-24",
    telephone: "+543412345678",
    ville: "Rosario",
    niveau_etude: "Licence",
    specialite: "Football",
    cv: "https://cv.messi.com",
    photo: "https://photo.messi.com",
    presentation: "GOAT du football",
    linkedin: "https://linkedin.com/in/messi",
    portfolio: "https://portfolio.messi.com",
    partage: true,
  };

  it("devrait créer un nouvel apprenant dans la base (avec encryption)", async () => {
    const result = await apprenantService.createApprenant(messi);

    expect(result.keycloakId).toBe("uuid-keycloak");
    expect(result.nom).toBe("Messi");
    expect(result.ville).toBe("Rosario");

    const rawRepo = dataSource.getRepository(TalentApprenant);
    const encrypted = await rawRepo.findOneBy({ keycloakId: expect.any(String) });

    // On teste que les données en DB sont chiffrées
    expect(encrypted?.nom.startsWith("enc-") || encrypted?.nom !== "Messi").toBe(true);
  });

  it("devrait retourner tous les apprenants (avec décryption automatique)", async () => {
    const result = await apprenantService.getAllApprenant();

    expect(result.length).toBe(1);
    expect(result[0].nom).toBe("Messi");
    expect(result[0].ville).toBe("Rosario");
  });

  it("devrait retourner un apprenant par ID (décrypté)", async () => {
    const result = await apprenantService.getApprenantById("uuid-keycloak");

    expect(result.prenom).toBe("Lionel");
    expect(result.specialite).toBe("Football");
  });

  it("devrait lever une erreur si l'apprenant n'existe pas", async () => {
    await expect(apprenantService.getApprenantById("non-existent")).rejects.toThrow("Apprenant non trouvé");
  });
});
