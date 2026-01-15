"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const rootPath = process.cwd();
const envPath = (0, path_1.resolve)(rootPath, '.env');
const result = (0, dotenv_1.config)({ path: envPath });
if (!process.env.DATABASE_URL) {
    console.error("⚠️  ATTENTION: DATABASE_URL n'est pas défini dans les variables d'environnement.\n" +
        `Fichier .env cherché à: ${envPath}\n` +
        `Fichier .env existe: ${result.parsed ? 'Oui' : 'Non'}\n` +
        'Veuillez créer un fichier .env à la racine du projet avec DATABASE_URL.\n' +
        'Exemple: DATABASE_URL="postgresql://user:password@localhost:5432/hackathon?schema=public"');
}
else {
    console.log(`✅ DATABASE_URL chargé depuis: ${envPath}`);
}
//# sourceMappingURL=env.config.js.map