import * as dotenv from "dotenv";
dotenv.config();

import "reflect-metadata";
import { AppDataSource } from "./config/database";
import path from "path";
import app from "./App";
import express from 'express';

AppDataSource.initialize()
  .then(() => {
    const env: string = process.env.NODE_ENV || "development";

    const envPath: string = path.resolve(process.cwd(), `.env.${env}`);
    dotenv.config({ path: envPath });
    app.use(express.json());
    const port: number = Number(process.env.PORT);
    app.listen(port, () => {
      console.log(`talentup-apprenant est démarrée sur le port: ${port}`);
    });
  })
  .catch((error) => console.log("Erreur de connexion à la base :", error));
