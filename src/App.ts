import express, { Application } from "express";
import apprenantsRoutes from "./routes/ApprenantRoute";
import webinaireRoutes from "./routes/WebinaireRoute";

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.initialisationMiddlewares();
        this.initialisationRoutes();
    }

    private initialisationMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
    }

    private initialisationRoutes(): void {
        this.app.use('/', apprenantsRoutes);
        this.app.use('/', webinaireRoutes);
    }
}

export default new App().app;
