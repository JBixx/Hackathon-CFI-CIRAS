import { z } from 'zod';
export declare const RefreshTokenDtoSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, z.core.$strip>;
export type RefreshTokenDtoZod = z.infer<typeof RefreshTokenDtoSchema>;
