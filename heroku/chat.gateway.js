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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
let ChatGateway = class ChatGateway {
    constructor() {
        this.onlineList = [];
    }
    handleMessage(client, chat) {
        client.broadcast.emit('message', chat);
        return chat;
    }
    handleIdentity(client, name) {
        this.onlineList.push({
            id: client.id,
            name: name,
        });
        this.io.emit('identity', name);
        this.io.emit('onlineListRefresh', [...this.onlineList.map((arr) => arr.name)]);
    }
    handleTyping(client) {
        client.broadcast.emit('typing');
    }
    handleDisconnect(client) {
        const index = this.onlineList.map((identity) => identity.id).indexOf(client.id);
        const theOneWhoDisconnected = this.onlineList[index].name;
        this.onlineList.splice(index, 1);
        const data = {
            theOneWhoDisconnected,
            list: [...this.onlineList.map((arr) => arr.name)],
        };
        client.broadcast.emit('someoneDisconnected', data);
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", Object)
], ChatGateway.prototype, "io", void 0);
__decorate([
    websockets_1.SubscribeMessage('message'),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    websockets_1.SubscribeMessage('identity'),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleIdentity", null);
__decorate([
    websockets_1.SubscribeMessage('typing'),
    __param(0, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTyping", null);
__decorate([
    __param(0, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleDisconnect", null);
ChatGateway = __decorate([
    websockets_1.WebSocketGateway()
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map