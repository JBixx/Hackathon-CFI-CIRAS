import { z } from 'zod';
export declare const CreateTeamDtoSchema: z.ZodObject<{
    nom: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    projetNom: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
