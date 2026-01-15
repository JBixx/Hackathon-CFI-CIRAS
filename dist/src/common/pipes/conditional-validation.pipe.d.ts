import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import type { ValidationPipeOptions } from '@nestjs/common';
export declare class ConditionalValidationPipe extends ValidationPipe {
    constructor(options?: ValidationPipeOptions);
    transform(value: any, metadata: ArgumentMetadata): any;
}
