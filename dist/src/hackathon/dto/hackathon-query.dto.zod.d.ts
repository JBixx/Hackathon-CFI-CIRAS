import { z } from 'zod';
export declare const HackathonQueryDtoSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    year: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type HackathonQueryDtoZod = z.infer<typeof HackathonQueryDtoSchema>;
