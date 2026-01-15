import { z } from 'zod';
export declare const AiLogsQueryDtoSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    type: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AiLogsQueryDtoZod = z.infer<typeof AiLogsQueryDtoSchema>;
