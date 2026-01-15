import { z } from 'zod';
export declare const UsersQueryDtoSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    role: z.ZodOptional<z.ZodEnum<{
        USER: "USER";
        ADMIN: "ADMIN";
    }>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UsersQueryDtoZod = z.infer<typeof UsersQueryDtoSchema>;
