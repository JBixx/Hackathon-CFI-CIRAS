import { ZodSchema } from 'zod';
export declare function UseZodValidation(schema: ZodSchema): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare const ZodValidation: typeof UseZodValidation;
