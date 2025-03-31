import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "./config";
import { TalentApprenant } from "../entities/apprenant.entity";
import { TalentupWebinaire } from "../entities/webinaire.entity";
import { TalentupWebinaireControle } from "../entities/controle-webinaire.entity";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: config.db.host,
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    synchronize: true,
    logging: true,
    entities: [TalentApprenant, TalentupWebinaire, TalentupWebinaireControle],
});
