import { z } from 'zod';
export declare const ChangePasswordDtoSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
export type ChangePasswordDtoZod = z.infer<typeof ChangePasswordDtoSchema>;
