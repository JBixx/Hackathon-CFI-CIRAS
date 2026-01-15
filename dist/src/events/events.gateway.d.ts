import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleSubscribeDashboard(client: Socket): void;
    handleUnsubscribeDashboard(client: Socket): void;
    emitNewInscription(data: {
        userId: string;
        hackathonId: string;
        inscriptionId: string;
        userEmail: string;
        userName: string;
    }): void;
    emitStatsUpdate(stats: {
        totalInscrits: number;
        parPromo: Array<{
            promo: string;
            count: number;
        }>;
        parTechnologie: Array<{
            technologie: string;
            count: number;
        }>;
    }): void;
}
