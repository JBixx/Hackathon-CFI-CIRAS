import { z } from 'zod';
export declare const UpdateUserDtoSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    nom: z.ZodOptional<z.ZodString>;
    prenom: z.ZodOptional<z.ZodString>;
    promo: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    technologies: z.ZodOptional<z.ZodArray<z.ZodString>>;
    role: z.ZodOptional<z.ZodEnum<{
        USER: "USER";
        ADMIN: "ADMIN";
    }>>;
}, z.core.$strip>;
export type UpdateUserDtoZod = z.infer<typeof UpdateUserDtoSchema>;
