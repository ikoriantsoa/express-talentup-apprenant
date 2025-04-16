import { ApprenantService } from "../src/apprenant/ApprenantService";
import { AppDataSource } from "../src/config/database";

describe("ApprenantService - Tests unitaires avec TalentApprenant", () => {
  let apprenantService: ApprenantService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      softRemove: jest.fn(),
    };

    jest.spyOn(AppDataSource, "getRepository").mockReturnValue(mockRepository);
    apprenantService = new ApprenantService();
  });

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

  const ronaldo = {
    keycloakId: "uuid-ronaldo",
    nom: "Ronaldo",
    prenom: "Cristiano",
    date_naissance: "1985-02-05",
    telephone: "+351912345678",
    ville: "Funchal",
    niveau_etude: "Master",
    specialite: "Football",
    cv: null,
    photo: null,
    presentation: "Machine à buts",
    linkedin: "https://linkedin.com/in/cr7",
    portfolio: null,
    partage: true,
  };

  describe("createApprenant", () => {
    it("doit créer un nouvel apprenant (Lionel Messi)", async () => {
      const apprenantAvecMeta = {
        ...messi,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      mockRepository.create.mockReturnValue(messi);
      mockRepository.save.mockResolvedValue(apprenantAvecMeta);

      const result = await apprenantService.createApprenant(messi);

      expect(mockRepository.create).toHaveBeenCalledWith(messi);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toMatchObject(messi);
    });
  });

  describe("getAllApprenant", () => {
    it("doit retourner une liste d'apprenants décryptés", async () => {
      const apprenants = [
        {
          ...messi,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          ...ronaldo,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ];

      mockRepository.find.mockResolvedValue(apprenants);

      const result = await apprenantService.getAllApprenant();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject(messi);
      expect(result[1]).toMatchObject(ronaldo);
    });
  });

  describe("getApprenantById", () => {
    it("doit retourner un apprenant décrypté (Lionel Messi)", async () => {
      const apprenant = {
        ...messi,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      mockRepository.findOne.mockResolvedValue(apprenant);

      const result = await apprenantService.getApprenantById("uuid-keycloak");

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { keycloakId: "uuid-keycloak" },
      });
      expect(result).toMatchObject(messi);
    });

    it("doit lever une erreur si l'apprenant n'existe pas", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        apprenantService.getApprenantById("fake-id")
      ).rejects.toThrow("Apprenant non trouvé");
    });
  });
});
