import { z } from 'zod';
export declare const UpdateHackathonDtoSchema: z.ZodObject<{
    nom: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    dateDebut: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    dateFin: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    dateLimiteInscription: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    status: z.ZodOptional<z.ZodEnum<{
        UPCOMING: "UPCOMING";
        ONGOING: "ONGOING";
        PAST: "PAST";
    }>>;
}, z.core.$strip>;
export type UpdateHackathonDtoZod = z.infer<typeof UpdateHackathonDtoSchema>;
