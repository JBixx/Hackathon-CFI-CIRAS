import { z } from 'zod';
export declare const RegisterDtoSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    nom: z.ZodString;
    prenom: z.ZodString;
    promo: z.ZodOptional<z.ZodString>;
    technologies: z.ZodOptional<z.ZodArray<z.ZodString>>;
    hackathonId: z.ZodString;
}, z.core.$strip>;
export type RegisterDtoZod = z.infer<typeof RegisterDtoSchema>;
