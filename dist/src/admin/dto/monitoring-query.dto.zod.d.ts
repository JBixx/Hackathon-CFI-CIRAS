import { z } from 'zod';
export declare const MonitoringQueryDtoSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    type: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type MonitoringQueryDtoZod = z.infer<typeof MonitoringQueryDtoSchema>;
