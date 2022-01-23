import { Logger } from '@nestjs/common';
import { ConnectedSocket, OnGatewayDisconnect, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from './model/message';

@WebSocketGateway({
  cors: { // ! REQUIRED when your client is on a third-party origin (see also frontend/src/app/my-socket.service.ts)
    origin: 'http://localhost:4200',
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
})
export class MyGateway implements OnGatewayDisconnect, OnGatewayConnection {
  @WebSocketServer()
  io: Server;

  logger = new Logger(MyGateway.name);

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.warn(`${client.id} got disconnected`);
  }

  handleConnection(@ConnectedSocket() client: Socket): void {
    this.logger.debug(`${client.id} is connected...`);
  }

  @SubscribeMessage('message')
  message(@ConnectedSocket() client: Socket, @MessageBody() data: Message): string {
    this.logger.log(`${client.id} is sending a message to the public`);
    client.broadcast.emit('message-received', data); // broadcast to every socket except sender
    return data.message; // return response to (client) emit
    // socket.emit(ev, payload, (response)=> this is the value of message)
  }

  @SubscribeMessage('join-room')
  joinRoom(@ConnectedSocket() client: Socket, @MessageBody() topic: string): void {
    if (topic == 'foods') {
      client.leave('places');
      client.join('foods');
    } else if (topic == 'places') {
      client.leave('foods');
      client.join('places');
    }
  }

  @SubscribeMessage('message-room')
  messageRoom(@ConnectedSocket() client: Socket, @MessageBody() data: Message): string {
    this.logger.debug(`${client.id} is sending a message on ${data.topic}`);
    client.broadcast.to(data.topic).emit('room-message-received', data);
    return data.message;// return response to (client) emit
    // socket.emit(ev, payload, (response)=> this is the value of request.message)
  }
}
