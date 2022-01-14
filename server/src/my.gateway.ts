import { Logger } from '@nestjs/common';
import { ConnectedSocket, OnGatewayDisconnect, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
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
  message(@ConnectedSocket() client: Socket, @MessageBody() message: string): string {
    this.logger.log(`${client.id} is sending a message to the public`);
    client.broadcast.emit('message-received', message); // broadcast to every socket except sender
    return message; // return response to (client) emit
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
  messageRoom(@ConnectedSocket() client: Socket, @MessageBody() request: { message: string, topic: string; }): string {
    this.logger.debug(`${client.id} is sending a message on ${request.topic}`);
    client.broadcast.to(request.topic).emit('room-message-received', request.message);
    return request.message;// return response to (client) emit
    // socket.emit(ev, payload, (response)=> this is the value of request.message)
  }
}
