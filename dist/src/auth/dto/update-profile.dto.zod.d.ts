import { z } from 'zod';
export declare const UpdateProfileDtoSchema: z.ZodObject<{
    nom: z.ZodOptional<z.ZodString>;
    prenom: z.ZodOptional<z.ZodString>;
    promo: z.ZodOptional<z.ZodString>;
    technologies: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type UpdateProfileDtoZod = z.infer<typeof UpdateProfileDtoSchema>;
