import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { QueueService } from '../queue/queue.service';
import { EventsGateway } from '../events/events.gateway';
export declare class AuthService {
    private prisma;
    private jwtService;
    private queueService;
    private eventsGateway;
    constructor(prisma: PrismaService, jwtService: JwtService, queueService: QueueService, eventsGateway: EventsGateway);
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            nom: any;
            prenom: any;
            role: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        user: any;
        inscription: {
            id: string;
            hackathonId: string;
            promo: import("@prisma/client").$Enums.Promo | null;
            technologies: string[];
            statut: import("@prisma/client").$Enums.StatutInscription;
            createdAt: Date;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, updateDto: any): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword(userId: string, changePasswordDto: any): Promise<{
        message: string;
    }>;
}
