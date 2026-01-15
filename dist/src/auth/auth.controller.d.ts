import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: any): Promise<{
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
    login(req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            nom: any;
            prenom: any;
            role: any;
        };
    }>;
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: any, updateDto: any): Promise<{
        id: string;
        email: string;
        nom: string;
        prenom: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword(req: any, changePasswordDto: any): Promise<{
        message: string;
    }>;
}
