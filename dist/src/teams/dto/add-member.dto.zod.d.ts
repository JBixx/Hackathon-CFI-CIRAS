import { z } from 'zod';
export declare const AddMemberDtoSchema: z.ZodObject<{
    userId: z.ZodString;
    role: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
