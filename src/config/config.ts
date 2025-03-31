import * as dotenv from "dotenv";
import * as path from "path";

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const config = {
    db: {
        host: process.env.DBHOST,
        port: Number(process.env.DBPORT),
        username: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME,
    },
};
