import { PrismaService } from '../prisma/prisma.service';
export interface AnalysisResult {
    score: number;
    suggestions: string[];
    metadata: {
        reasons: string[];
        confidence: number;
    };
}
export declare class AiService {
    private prisma;
    constructor(prisma: PrismaService);
    analyzeInscription(userId: string): Promise<AnalysisResult>;
    private performAnalysis;
    getUserLogs(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.TypeIALog;
        input: import("@prisma/client/runtime/client").JsonValue;
        output: import("@prisma/client/runtime/client").JsonValue;
        score: number | null;
        suggestions: string[];
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    getAllLogs(page?: number, limit?: number, type?: string): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                nom: string;
                prenom: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            type: import("@prisma/client").$Enums.TypeIALog;
            input: import("@prisma/client/runtime/client").JsonValue;
            output: import("@prisma/client/runtime/client").JsonValue;
            score: number | null;
            suggestions: string[];
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
