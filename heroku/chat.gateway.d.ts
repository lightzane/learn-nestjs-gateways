import { OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Chat } from './shared/models/chat.model';
import { Identity } from './shared/models/identity.model';
export declare class ChatGateway implements OnGatewayDisconnect {
    onlineList: Identity[];
    io: Server;
    handleMessage(client: Socket, chat: Chat): Chat;
    handleIdentity(client: Socket, name: string): void;
    handleTyping(client: Socket): void;
    handleDisconnect(client: Socket): void;
}
