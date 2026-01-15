import { z } from 'zod';
export declare const CreateHackathonDtoSchema: z.ZodObject<{
    nom: z.ZodString;
    description: z.ZodString;
    dateDebut: z.ZodCoercedDate<unknown>;
    dateFin: z.ZodCoercedDate<unknown>;
    dateLimiteInscription: z.ZodCoercedDate<unknown>;
    status: z.ZodOptional<z.ZodEnum<{
        UPCOMING: "UPCOMING";
        ONGOING: "ONGOING";
        PAST: "PAST";
    }>>;
}, z.core.$strip>;
export type CreateHackathonDtoZod = z.infer<typeof CreateHackathonDtoSchema>;
