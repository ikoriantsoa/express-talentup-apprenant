import { AppDataSource } from '../src/config/database';
import { TalentApprenant } from '../src/entities/apprenant.entity';
import { TalentupWebinaireControle } from '../src/entities/controle-webinaire.entity';
import { TalentupWebinaire } from '../src/entities/webinaire.entity';
import WebinaireService from '../src/webinaire/WebinaireService';

describe("WebinaireService - Tests unitaires", () => {
  let webinaireService: WebinaireService;
  let mockWebinaireRepository: any;
  let mockApprenantRepository: any;
  let mockControleWebinaireRepository: any;

  beforeEach(() => {
    mockWebinaireRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    mockApprenantRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    mockControleWebinaireRepository = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    jest.spyOn(AppDataSource, "getRepository").mockImplementation((entity) => {
      if (entity === TalentupWebinaire) {
        return mockWebinaireRepository as any;
      }
      if (entity === TalentApprenant) {
        return mockApprenantRepository as any;
      }
      if (entity === TalentupWebinaireControle) {
        return mockControleWebinaireRepository as any;
      }
      return {} as any;
    });

    webinaireService = new WebinaireService();
  });

  describe("createWebinaire", () => {
    it("Ce test doit créer un webinaire et mettre à jour le status de partage de l'apprenant", async () => {
      const mockApprenant = {
        keycloakId: "dbfb21eb-2967-4f46-be5a-f28c2c95543f",
        partage: false,
      };

      const newWebinaire = {
        keycloakId: "dbfb21eb-2967-4f46-be5a-f28c2c95543f",
        titre: "Typescript",
        categorie: "Programmation",
        type: "Cours",
        niveau: "Débutant",
        image: "image-url",
        source: "video-url",
        auteur: "Lionel Messi",
      };

      mockApprenantRepository.findOne.mockResolvedValue(mockApprenant);
      mockWebinaireRepository.save.mockResolvedValue({
        webinaireid: "e6bac999-c253-47e2-8de1-b9540f5d1043",
        ...newWebinaire,
      });

      const result = await webinaireService.createWebinaire(newWebinaire);

      expect(mockApprenantRepository.findOne).toHaveBeenCalledWith({
        where: { keycloakId: "dbfb21eb-2967-4f46-be5a-f28c2c95543f" },
      });

      expect(mockApprenant.partage).toBe(true);
      expect(mockApprenantRepository.save).toHaveBeenCalledWith(mockApprenant);

      expect(mockWebinaireRepository.create).toHaveBeenCalledWith({
        titre: "Typescript",
        categorie: "Programmation",
        type: "Cours",
        niveau: "Débutant",
        image: "image-url",
        source: "video-url",
        auteur: "Lionel Messi",
      });

      expect(result).toEqual({
        webinaireid: "e6bac999-c253-47e2-8de1-b9540f5d1043",
        ...newWebinaire,
      });
    });

    it("Ce test doit générer une erreur si l'apprenant n'existe pas", async () => {
      const newWebinaire = {
        keycloakId: "ed829241-c7bd-4fc1-bfef-acff73076a0d",
        titre: "Typescript",
        categorie: "Programmation",
        type: "Cours",
        niveau: "Débutant",
        image: "image-url",
        source: "video-url",
        auteur: "Lionel Messi",
      };

      mockApprenantRepository.findOne.mockResolvedValue(null);

      await expect(webinaireService.createWebinaire(newWebinaire)).rejects.toThrow(
        "Le compte apprenant n' existe pas"
      );
    });
  });

  describe("getWebinaireById", () => {
    it("Ce test doit renvoyer les données du webinare lorsque le partage est vrai et que Webinaire contrôle est vide", async () => {
      const mockApprenant = {
        keycloakId: "ed829241-c7bd-4fc1-bfef-acff73076a0d",
        partage: true,
      };

      const mockWebinaire = {
        webinaireid: "e6bac999-c253-47e2-8de1-b9540f5d1043",
        updatedAt: new Date(),
        titre: "Typescript",
        categorie: "Programmation",
        type: "Cours",
        niveau: "Débutant",
        image: "image-url",
        source: "video-url",
      };

      mockApprenantRepository.findOne.mockResolvedValue(mockApprenant);
      mockControleWebinaireRepository.find.mockResolvedValue([]);
      mockWebinaireRepository.findOne.mockResolvedValue(mockWebinaire);

      const result = await webinaireService.getWebinaireById({
        webinaireId: "ed829241-c7bd-4fc1-bfef-acff73076a0d",
        keycloakId: "e6bac999-c253-47e2-8de1-b9540f5d1043",
      });

      // Vérifier que le contrôle du webinaire a été créé
      expect(mockControleWebinaireRepository.create).toHaveBeenCalledWith({
        keycloak_id: "e6bac999-c253-47e2-8de1-b9540f5d1043",
        webinaire_id: "ed829241-c7bd-4fc1-bfef-acff73076a0d",
      });

      // Vérifier que le statut de partage a été mis à jour
      expect(mockApprenant.partage).toBe(false);
      expect(mockApprenantRepository.save).toHaveBeenCalledWith(mockApprenant);

      // Vérifier le résultat final
      expect(result).toEqual({
        date: mockWebinaire.updatedAt,
        titre: mockWebinaire.titre,
        categorie: mockWebinaire.categorie,
        type: mockWebinaire.type,
        niveau: mockWebinaire.niveau,
        image: mockWebinaire.image,
        source: mockWebinaire.source,
      });
    });

    it("Ce test doit renvoyer les données webinaires lorsque le partage est vrai et que controleWebiniare existe", async () => {
      const mockApprenant = {
        keycloakId: "e6bac999-c253-47e2-8de1-b9540f5d1043",
        partage: true,
      };

      const mockWebinaire = {
        webinaireid: "ed829241-c7bd-4fc1-bfef-acff73076a0d",
        updatedAt: new Date(),
        titre: "TypeScript",
        categorie: "Programmation",
        type: "Cours",
        niveau: "Débutant",
        image: "image-url",
        source: "video-url",
      };

      mockApprenantRepository.findOne.mockResolvedValue(mockApprenant);
      mockControleWebinaireRepository.find.mockResolvedValue([{ id: 1 }]);
      mockWebinaireRepository.findOne.mockResolvedValue(mockWebinaire);

      const result = await webinaireService.getWebinaireById({
        webinaireId: "ed829241-c7bd-4fc1-bfef-acff73076a0d",
        keycloakId: "e6bac999-c253-47e2-8de1-b9540f5d1043",
      });

      // Vérifier que le contrôle du webinaire n'a pas été modifié
      expect(mockControleWebinaireRepository.create).not.toHaveBeenCalled();

      // Vérifier le résultat final
      expect(result).toEqual({
        date: mockWebinaire.updatedAt,
        titre: mockWebinaire.titre,
        categorie: mockWebinaire.categorie,
        type: mockWebinaire.type,
        niveau: mockWebinaire.niveau,
        image: mockWebinaire.image,
        source: mockWebinaire.source,
      });
    });

    it("Ce test doit générer une erreur lorsque le partage et faux et que le webinaire est vide", async () => {
      const mockApprenant = {
        keycloakId: "e6bac999-c253-47e2-8de1-b9540f5d1043",
        partage: false,
      };

      mockApprenantRepository.findOne.mockResolvedValue(mockApprenant);
      mockControleWebinaireRepository.find.mockResolvedValue([]);

      await expect(
        webinaireService.getWebinaireById({
          webinaireId: "ed829241-c7bd-4fc1-bfef-acff73076a0d",
          keycloakId: "e6bac999-c253-47e2-8de1-b9540f5d1043",
        })
      ).rejects.toThrow("Vous ne pouvez pas voir ce webinaire, partager d'abord");
    });
  });
});