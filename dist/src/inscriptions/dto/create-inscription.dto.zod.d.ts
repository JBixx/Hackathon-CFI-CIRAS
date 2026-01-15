import { z } from 'zod';
export declare const CreateInscriptionDtoSchema: z.ZodObject<{
    hackathonId: z.ZodString;
}, z.core.$strip>;
export type CreateInscriptionDtoZod = z.infer<typeof CreateInscriptionDtoSchema>;
