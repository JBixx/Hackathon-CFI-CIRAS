import { z } from 'zod';
export declare const CreateAnnonceDtoSchema: z.ZodObject<{
    titre: z.ZodString;
    contenu: z.ZodString;
    cible: z.ZodEnum<{
        PUBLIC: "PUBLIC";
        INSCRITS: "INSCRITS";
    }>;
    hackathonId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateAnnonceDtoZod = z.infer<typeof CreateAnnonceDtoSchema>;
