"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EventsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let EventsGateway = EventsGateway_1 = class EventsGateway {
    server;
    logger = new common_1.Logger(EventsGateway_1.name);
    handleConnection(client) {
        this.logger.log(`Client connecté: ${client.id}`);
        client.emit('connected', { message: "Connecté au serveur d'événements" });
    }
    handleDisconnect(client) {
        this.logger.log(`Client déconnecté: ${client.id}`);
    }
    handleSubscribeDashboard(client) {
        this.logger.log(`Client ${client.id} s'est abonné au dashboard`);
        client.join('dashboard');
        client.emit('subscribed', { room: 'dashboard' });
    }
    handleUnsubscribeDashboard(client) {
        this.logger.log(`Client ${client.id} s'est désabonné du dashboard`);
        client.leave('dashboard');
    }
    emitNewInscription(data) {
        this.server.to('dashboard').emit('new-inscription', {
            type: 'new-inscription',
            data,
            timestamp: new Date(),
        });
        this.logger.log(`Événement new-inscription émis pour ${data.userEmail}`);
    }
    emitStatsUpdate(stats) {
        this.server.to('dashboard').emit('stats-update', {
            type: 'stats-update',
            data: stats,
            timestamp: new Date(),
        });
        this.logger.log('Événement stats-update émis');
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe-dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleSubscribeDashboard", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe-dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleUnsubscribeDashboard", null);
exports.EventsGateway = EventsGateway = EventsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: '/events',
    })
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map