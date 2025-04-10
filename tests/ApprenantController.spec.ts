import { ICryptage } from "../src/cryptage/ICryptage";
import { newDb } from "pg-mem";
import { TalentApprenant } from "../src/entities/apprenant.entity";
import { ApprenantController } from "../src/apprenant/ApprenantController";
import { DataSource } from "typeorm";
import { AppDataSource } from "../src/config/database";
import express from "express";
import request from "supertest";
import { ApprenantService } from "../src/apprenant/ApprenantService";

class MockCryptageService {
  encrypt(data: string): ICryptage {
    return {
      iv: "mock-iv",
      encryptedText: `encrypted-${data}`,
    };
  }

  decrypt(data: ICryptage): string {
    return data.encryptedText.replace("encrypted-", "");
  }
}

describe("ApprenantController - Tests d'intégrations", () => {
  let app: any;
  let controller: ApprenantController;
  let dataSource: DataSource;

  beforeAll(async () => {
    const db = newDb();
    
    db.public.registerFunction({
        name: "current_database",
        implementation: () => "pg_mem_test_db",
      });
    
      db.public.registerFunction({
        name: "version",
        implementation: () => "PostgreSQL 14.0 on pg-mem",
      });

    const typeOrmDataSource = await db.adapters.createTypeormDataSource({
      type: "postgres",
      entities: [TalentApprenant],
      synchronize: true,
      database: "pg_mem_test_db",
    });

    dataSource = typeOrmDataSource;
    await dataSource.initialize();
    console.log("Base de données en mémoire Apprenant initialisée !");

    jest.spyOn(AppDataSource, "getRepository").mockImplementation((entity) => {
      return dataSource.getRepository(entity);
    });

    app = express();
    app.use(express.json());

    const mockCryptageService = new MockCryptageService();
    const apprenantService = new ApprenantService();
    (apprenantService as any).cryptageService = mockCryptageService;

    controller = new ApprenantController();

    app.get(
      "/talentApprenant/allApprenant",
      controller.getAllApprenant.bind(controller)
    );
    app.get(
      "/talentApprenant/apprenant/46c6708c-5e61-44ea-bfc9-3d3698289760",
      controller.getApprenantById.bind(controller)
    );
    app.post(
      "/talentApprenant/createApprenant",
      controller.createApprenant.bind(controller)
    );
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
  });

  describe("POST /talentApprenant/createApprenant", () => {
    it("Ce test doit créer un nouveau apprenant et retourne un status 201", async () => {
      const newApprenant = {
        apprenant: {
          keycloakId: "46c6708c-5e61-44ea-bfc9-3d3698289760",
          username: "leo-messi",
          email: "leomessi@email.com",
          firstname: "Lionel",
          lastname: "Messi",
          adresse: "Rosario - Argentine",
        },
      };

      const response = await request(app)
        .post("/talentApprenant/createApprenant")
        .send(newApprenant)
        .expect(201);

      expect(response.body).toMatchObject({
        keycloakId: "46c6708c-5e61-44ea-bfc9-3d3698289760",
        username: {
          iv: "mock-iv",
          encryptedText: "encrypted-leo-messi",
        },
        email: {
          iv: "mock-iv",
          encryptedText: "encrypted-leomessi@email.com",
        },
        firstname: {
          iv: "mock-iv",
          encryptedText: "encrypted-Lionel",
        },
        lastname: {
          iv: "mock-iv",
          encryptedText: "encrypted-Messi",
        },
        adresse: {
          iv: "mock-iv",
          encryptedText: "encrypted-Rosario - Argentine",
        },
      });
    });
  });

  describe("GET /talentApprenant/allApprenant", () => {
    it("Ce test retourne la liste des apprenants décryptées", async () => {
      const apprenantRepository = dataSource.getRepository(TalentApprenant);
      await apprenantRepository.save({
        keycloakId: "46c6708c-5e61-44ea-bfc9-3d3698289760",
        username: {
          iv: "mock-iv",
          encryptedText: "encrypted-leo-messi",
        },
        email: {
          iv: "mock-iv",
          encryptedText: "encrypted-leomessi@email.com",
        },
        firstname: {
          iv: "mock-iv",
          encryptedText: "encrypted-Lionel",
        },
        lastname: {
          iv: "mock-iv",
          encryptedText: "encrypted-Messi",
        },
        adresse: {
          iv: "mock-iv",
          encryptedText: "encrypted-Rosario - Argentine",
        },
      });

      const response = await request(app)
        .get("/talentApprenant/allApprenant")
        .expect(200);

      expect(response.body).toEqual([
        {
          keycloakId: "46c6708c-5e61-44ea-bfc9-3d3698289760",
          username: "leo-messi",
          email: "leomessi@email.com",
          firstname: "Lionel",
          lastname: "Messi",
          adresse: "Rosario - Argentine",
        },
      ]);
    });
  });

  describe("GET /talentApprenant/46c6708c-5e61-44ea-bfc9-3d3698289760", () => {
    it("Ce test doit retourner un apprenant décrypté selon son keycloakId", async () => {
      const apprenantRepository = dataSource.getRepository(TalentApprenant);
      await apprenantRepository.save({
        keycloakId: "46c6708c-5e61-44ea-bfc9-3d3698289760",
        username: {
          iv: "mock-iv",
          encryptedText: "encrypted-leo-messi",
        },
        email: {
          iv: "mock-iv",
          encryptedText: "encrypted-leomessi@email.com",
        },
        firstname: {
          iv: "mock-iv",
          encryptedText: "encrypted-Lionel",
        },
        lastname: {
          iv: "mock-iv",
          encryptedText: "encrypted-Messi",
        },
        adresse: {
          iv: "mock-iv",
          encryptedText: "encrypted-Rosario - Argentine",
        },
      });

      const response = await request(app)
        .get("/talentApprenant/46c6708c-5e61-44ea-bfc9-3d3698289760")
        .expect(200);

      expect(response.body).toEqual({
        keycloakId: "46c6708c-5e61-44ea-bfc9-3d3698289760",
        username: "leo-messi",
        email: "leomessi@email.com",
        firstname: "Lionel",
        lastname: "Messi",
        adresse: "Rosario - Argentine",
      });
    });

    it("Ce test doit retourner une erreur 500 si l'apprenant n'existe pas", async () => {
        const response = await request(app).get("/talentApprenant/36c6708c-5e61-44ea-bfc9-3d3698289760").expect(500);

        expect(response.body).toEqual({
            message: "Erreur lors de la récupération d'un apprenant : Error: Apprenant non trouvé",
        });
    });
  });
});
