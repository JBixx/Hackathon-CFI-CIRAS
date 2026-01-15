import { z } from 'zod';
export declare const UpdateAnnonceDtoSchema: z.ZodObject<{
    titre: z.ZodOptional<z.ZodString>;
    contenu: z.ZodOptional<z.ZodString>;
    cible: z.ZodOptional<z.ZodEnum<{
        PUBLIC: "PUBLIC";
        INSCRITS: "INSCRITS";
    }>>;
    hackathonId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type UpdateAnnonceDtoZod = z.infer<typeof UpdateAnnonceDtoSchema>;
