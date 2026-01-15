"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log('🔧 MAIN: Loading environment configuration...');
require('./config/env.config');
console.log('✅ MAIN: Environment configuration loaded');
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const nest_winston_1 = require("nest-winston");
const app_module_1 = require("./app.module");
const conditional_validation_pipe_1 = require("./common/pipes/conditional-validation.pipe");
async function bootstrap() {
    console.log('🏗️ MAIN: Creating NestJS application...');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    console.log('✅ MAIN: NestJS application created successfully');
    console.log('🔒 MAIN: Configuring CORS...');
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }
            const allowedOrigins = [
                'http://localhost:9002',
                'http://localhost:5173',
                'http://localhost:3001',
                'http://127.0.0.1:9002',
                'http://127.0.0.1:5173',
            ];
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                if (origin.startsWith('http://localhost:') ||
                    origin.startsWith('http://127.0.0.1:')) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS'));
                }
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        exposedHeaders: ['Authorization'],
    });
    app.useLogger(app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER));
    app.useGlobalPipes(new conditional_validation_pipe_1.ConditionalValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        skipMissingProperties: false,
        skipNullProperties: false,
        skipUndefinedProperties: false,
        transformOptions: {
            enableImplicitConversion: false,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API Hackathon')
        .setDescription('API pour la gestion des hackathons')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '0.0.0.0';
    console.log(`🚀 MAIN: Starting server on ${host}:${port}...`);
    await app.listen(port, host);
    console.log(`✅ MAIN: Application successfully started!`);
    console.log(`🌐 Application is running on: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`);
    console.log(`📚 Swagger documentation: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map