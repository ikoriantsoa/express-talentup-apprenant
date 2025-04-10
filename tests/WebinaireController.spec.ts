import { newDb } from "pg-mem";
import { v4 as uuidv4 } from "uuid";
import { DataSource } from "typeorm";
import request from "supertest";
import express, { Express } from "express";
import WebinaireController from "../src/webinaire/WebinaireController";
import { TalentApprenant } from "../src/entities/apprenant.entity";
import { TalentupWebinaire } from "../src/entities/webinaire.entity";
import { TalentupWebinaireControle } from "../src/entities/controle-webinaire.entity";
import { AppDataSource } from "../src/config/database";

describe("WebinaireController - Tests d'intégrations", () => {
  let app: Express;
  let controller: WebinaireController;
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

    db.public.registerFunction({
      name: "uuid_generate_v4",
      args: [],
      implementation: () => {
        return uuidv4;
      },
    });

    const typeOrmDataSource = await db.adapters.createTypeormDataSource({
      type: "postgres",
      entities: [TalentApprenant, TalentupWebinaire, TalentupWebinaireControle],
      synchronize: true,
    });

    dataSource = typeOrmDataSource;
    await dataSource.initialize();

    jest.spyOn(AppDataSource, "getRepository").mockImplementation((entity) => {
      return dataSource.getRepository(entity);
    });

    app = express();
    app.use(express.json());

    controller = new WebinaireController();

    app.post("/createWebinaire", controller.createWebinaire.bind(controller));
    app.get(
      "/getWebinaire/46c6708c-5e61-44ea-bfc9-3d3698289760/e6bac999-c253-47e2-8de1-b9540f5d1043",
      controller.getWebinaireById.bind(controller)
    );
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe("POST /webinaires", () => {
    it("Ce test doit créer un webinaire et renvoyer un status 201", async () => {
      const apprenantRepository = dataSource.getRepository(TalentApprenant);
      await apprenantRepository.save({
        keycloakId: "46c6708c-5e61-44ea-bfc9-3d3698289760",
        username: { iv: "mock-iv", encryptedText: "encrypted-leo-messi" },
        email: { iv: "mock-iv", encryptedText: "encrypted-leomessi@email.com" },
        firstname: { iv: "mock-iv", encryptedText: "encrypted-Lionel" },
        lastname: { iv: "mock-iv", encryptedText: "encrypted-Messi" },
        adresse: {
          iv: "mock-iv",
          encryptedText: "encrypted-Rosario - Argentine",
        },
        partage: false,
      });

      const newWebinaire = {
        dataWebinaire: {
          keycloakId: "46c6708c-5e61-44ea-bfc9-3d3698289760",
          titre: "TypeScript",
          categorie: "Programmation",
          type: "Cours",
          niveau: "Débutant",
          image: "image-url",
          source: "video-url",
          auteur: "leo-messi",
        },
      };

      const response = await request(app)
        .post("/createWebinaire")
        .send(newWebinaire)
        .expect(201);

      expect(response.body).toMatchObject({
        keycloakId: "46c6708c-5e61-44ea-bfc9-3d3698289760",
        titre: "TypeScript",
        categorie: "Programmation",
        type: "Cours",
        niveau: "Débutant",
        image: "image-url",
        source: "video-url",
        auteur: "leo-messi",
      });
    });

    it("Ce test doit renvoyer une erreur 500 si l'apprenant n'existe pas", async () => {
      const newWebinaire = {
        dataWebinaire: {
          keycloakId: "46c6708c-5e61-44ea-bfc9-3d3698289760",
          titre: "TypeScript",
          categorie: "Programmation",
          type: "Cours",
          niveau: "Débutant",
          image: "image-url",
          source: "video-url",
          auteur: "leo-messi",
        },
      };

      const response = await request(app)
        .post("/talentApprenant/createWebinaire")
        .send(newWebinaire)
        .expect(500);

      expect(response.body).toEqual({
        error: "Erreur lors de la création de l'apprenant",
      });
    });
  });

  describe("GET /webinaires/:keycloakId/:webinaireId", () => {
    it("Ce test doit renvoyer les données du webinaire lorsque le partage est vrai et que controleWebinaire est vide", async () => {
      const apprenantRepository = dataSource.getRepository(TalentApprenant);
      await apprenantRepository.save({
        keycloakId: "46c6708c-5e61-44ea-bfc9-3d3698289760",
        username: { iv: "mock-iv", encryptedText: "encrypted-leo-messi" },
        email: { iv: "mock-iv", encryptedText: "encrypted-leomessi@email.com" },
        firstname: { iv: "mock-iv", encryptedText: "encrypted-Lionel" },
        lastname: { iv: "mock-iv", encryptedText: "encrypted-Messi" },
        adresse: {
          iv: "mock-iv",
          encryptedText: "encrypted-Rosario - Argentine",
        },
        partage: true,
      });

      const webinaireRepository = dataSource.getRepository(TalentupWebinaire);
      const webinaire = await webinaireRepository.save({
        webinaireid: "e6bac999-c253-47e2-8de1-b9540f5d1043",
        titre: "TypeScript",
        categorie: "Programmation",
        type: "Cours",
        niveau: "Débutant",
        image: "image-url",
        source: "video-url",
        auteur: "leo-messi",
      });

      const response = await request(app).get("/talentApprenant/getWebinaire/46c6708c-5e61-44ea-bfc9-3d3698289760/e6bac999-c253-47e2-8de1-b9540f5d1043").expect(200);

      expect(response.body).toEqual({
        date: expect.any(String),
        titre: "TypeScript",
        categorie: "Programmation",
        type: "Cours",
        niveau: "Débutant",
        image: "image-url",
        source: "video-url",
      });
    });

    it("Ce test doit renvoyer une erreur 500 si l'apprenant n'existe pas", async () => {
      const response = await request(app)
        .get("/talentApprenant/getWebinaire/e023c34b-9f6e-4e42-bbea-877b30a79a05/e6bac999-c253-47e2-8de1-b9540f5d1043")
        .expect(500);

      expect(response.body).toEqual({
        message:
          "Erreur lors de la récupération d'un webinaire : Error: Apprenant inexistant!",
      });
    });
  });
});
