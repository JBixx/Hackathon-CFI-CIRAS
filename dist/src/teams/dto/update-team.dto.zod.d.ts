import { z } from 'zod';
export declare const UpdateTeamDtoSchema: z.ZodObject<{
    nom: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    projetNom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
