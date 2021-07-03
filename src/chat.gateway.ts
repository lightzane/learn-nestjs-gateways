import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Chat } from './shared/models/chat.model';
import { Identity } from './shared/models/identity.model';

@WebSocketGateway()
export class ChatGateway implements OnGatewayDisconnect {
    onlineList: Identity[] = [];

    @WebSocketServer()
    io: Server;

    @SubscribeMessage('message')
    handleMessage(@ConnectedSocket() client: Socket, @MessageBody() chat: Chat): Chat {
        // emit send to everyone except sender
        client.broadcast.emit('message', chat);

        // return data to sender
        return chat;
    }

    @SubscribeMessage('identity')
    handleIdentity(@ConnectedSocket() client: Socket, @MessageBody() name: string): void {
        // add to online list
        this.onlineList.push({
            id: client.id,
            name: name,
        });

        // emit send to all clients
        this.io.emit('identity', name);
        this.io.emit('onlineListRefresh', [...this.onlineList.map((arr) => arr.name)]);
    }

    @SubscribeMessage('typing')
    handleTyping(@ConnectedSocket() client: Socket) {
        client.broadcast.emit('typing');
    }

    // implements OnGatewayDisconnect
    handleDisconnect(@ConnectedSocket() client: Socket) {
        // looks for the existing client.id in the list
        const index = this.onlineList.map((identity) => identity.id).indexOf(client.id);

        // get first the name before removing it
        const theOneWhoDisconnected = this.onlineList[index].name;

        // and removes it from the list
        this.onlineList.splice(index, 1);

        // prep data
        const data = {
            theOneWhoDisconnected,
            list: [...this.onlineList.map((arr) => arr.name)],
        };

        // broadcast to everyone (except sender) that this socket/person was disconnected
        client.broadcast.emit('someoneDisconnected', data);
    }
}
