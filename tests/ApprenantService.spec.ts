import { ApprenantService } from "../src/apprenant/ApprenantService";
import { AppDataSource } from "../src/config/database";

describe("ApprenantService - Tests unitaires", () => {
  let apprenantService: ApprenantService;
  let mockRepository: any;
  let mockCryptageService: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      softRemove: jest.fn(),
    };

    mockCryptageService = {
      encrypt: jest.fn((data: string) => `encrypted-${data}`),
      decrypt: jest.fn((data: string) => data.replace("encrypted-", "")),
    };

    jest
      .spyOn(AppDataSource, "getRepository")
      .mockReturnValue(mockRepository as any);
    apprenantService = new ApprenantService();
    (apprenantService as any).cryptageService = mockCryptageService;
  });

  describe("createApprenant", () => {
    it("Ce test doit crypter les données et créer un nouveau apprenant", async () => {
      const newApprenant = {
        keycloakId: "uuid-keycloak",
        username: "leo-messi",
        email: "leomessi@mail.com",
        firstname: "Lionel",
        lastname: "Messi",
        adresse: "Rosario - Argentine",
      };

      mockRepository.save.mockResolvedValue({
        keycloakId: "uuid-keycloak",
        username: "encrypted-leo-messi",
        email: "encrypted-leomessi@mail.com",
        firstname: "encrypted-Lionel",
        lastname: "encrypted-Messi",
        adresse: "encrypted-Rosario - Argentine",
      });

      const result = await apprenantService.createApprenant(newApprenant);

      
      expect(mockCryptageService.encrypt).toHaveBeenCalledWith("leo-messi");
      expect(mockCryptageService.encrypt).toHaveBeenCalledWith("leomessi@mail.com");
      expect(mockCryptageService.encrypt).toHaveBeenCalledWith("Lionel");
      expect(mockCryptageService.encrypt).toHaveBeenCalledWith("Messi");
      expect(mockCryptageService.encrypt).toHaveBeenCalledWith("Rosario - Argentine");
      
      expect(mockRepository.create).toHaveBeenCalledWith({
        keycloakId: "uuid-keycloak",
        username: "encrypted-leo-messi",
        email: "encrypted-leomessi@mail.com",
        firstname: "encrypted-Lionel",
        lastname: "encrypted-Messi",
        adresse: "encrypted-Rosario - Argentine",
      });

      expect(result).toEqual({
        keycloakId: "uuid-keycloak",
        username: "encrypted-leo-messi",
        email: "encrypted-leomessi@mail.com",
        firstname: "encrypted-Lionel",
        lastname: "encrypted-Messi",
        adresse: "encrypted-Rosario - Argentine",
      });
    });
  });

  describe("getAllApprenant", () => {
    it("Ce test doit décrypter tous les apprenants et retourne une liste", async () => {
      const apprenantsCrypte = [
        {
          keycloakId: "uuid-keycloak",
          username: "encrypted-leo-messi",
          email: "encrypted-leomessi@mail.com",
          firstname: "encrypted-Lionel",
          lastname: "encrypted-Messi",
          adresse: "encrypted-Rosario - Argentine",
        },
      ];

      mockRepository.find.mockResolvedValue(apprenantsCrypte);

      const result = await apprenantService.getAllApprenant();

      expect(mockCryptageService.decrypt).toHaveBeenCalledWith(
        "encrypted-leo-messi"
      );
      expect(mockCryptageService.decrypt).toHaveBeenCalledWith(
        "encrypted-leomessi@mail.com"
      );
      expect(mockCryptageService.decrypt).toHaveBeenCalledWith(
        "encrypted-Lionel"
      );
      expect(mockCryptageService.decrypt).toHaveBeenCalledWith(
        "encrypted-Messi"
      );
      expect(mockCryptageService.decrypt).toHaveBeenCalledWith(
        "encrypted-Rosario - Argentine"
      );

      expect(result).toEqual([
        {
            keycloakId: "uuid-keycloak",
            username: "leo-messi",
            email: "leomessi@mail.com",
            firstname: "Lionel",
            lastname: "Messi",
            adresse: "Rosario - Argentine",
          }
      ]);
    });
  });

  describe("getApprenantById", () => {
    it("Ce test doit décrypter et retourner un utilisateur par son keycloakId", async () => {
      const apprenantCrypte = {
        keycloakId: "uuid-keycloak",
        username: "encrypted-leo-messi",
        email: "encrypted-leomessi@mail.com",
        firstname: "encrypted-Lionel",
        lastname: "encrypted-Messi",
        adresse: "encrypted-Rosario - Argentine",
      };

      mockRepository.findOne.mockResolvedValue(apprenantCrypte);

      const result = await apprenantService.getApprenantById("uuid-keycloak");

      expect(mockCryptageService.decrypt).toHaveBeenCalledWith(
        "encrypted-leo-messi"
      );
      expect(mockCryptageService.decrypt).toHaveBeenCalledWith(
        "encrypted-leomessi@mail.com"
      );
      expect(mockCryptageService.decrypt).toHaveBeenCalledWith(
        "encrypted-Lionel"
      );
      expect(mockCryptageService.decrypt).toHaveBeenCalledWith(
        "encrypted-Messi"
      );
      expect(mockCryptageService.decrypt).toHaveBeenCalledWith(
        "encrypted-Rosario - Argentine"
      );

      expect(result).toEqual({
        keycloakId: "uuid-keycloak",
        username: "leo-messi",
        email: "leomessi@mail.com",
        firstname: "Lionel",
        lastname: "Messi",
        adresse: "Rosario - Argentine",
      });
    });

    it(`Ce test doit lever une erreur si l'apprenant n'existe pas`, async () => {
        mockRepository.findOne.mockResolvedValue(null);

        await expect(apprenantService.getApprenantById('pas-messi')).rejects.toThrow("Apprenant non trouvé");
    });
  });
});
