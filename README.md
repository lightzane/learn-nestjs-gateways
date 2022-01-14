# Angular and NestJs + Gateways

![NestJs v8](https://img.shields.io/badge/nestjs-8.0.0-red) ![Socket.io Client v4](https://img.shields.io/badge/socket.io--client-4.4.0-red)

This project contains `Angular` (frontend) and `Nestjs` (server) application that uses web sockets.

## Final Output Demo

1. Go to `/server` folder
2. `npm install`
3. `npm start`

## Installation

In **nestjs** project directory:

```
npm i @nestjs/websockets @nestjs/platform-socket.io
```

Note: The types for socket.io is already included in `@nestjs/cli@v8.0.0` via `@nestjs/websockets@8.0.0`

In **angular** project directory:

```
npm i socket.io-client@4.4.0
```

Note: This npm package may apply to any typescript project

## Add code to the following

-   [Socket Server](#socket-server)
-   [Socket Client](#socket-client)

### Socket Server

```
nest g gateway <filename>
```

This will generated a `filename.gateway.ts` file and nest will auto inject it in the closest `xxx.module.ts` in the specified path

```typescript
import { ConnectedSocket, MessageBody, OnGatewayDisconnect, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class FilenameGateway implements OnGatewayDisconnect, OnGatewayConnection {
    @WebSocketServer()
    io: Server; // optional if you need direct access to io server

    logger = new Logger(FilenameGateway.name);

    handleDisconnect(@ConnectedSocket() client: Socket) {
        this.logger.warn(`${client.id} got disconnected`);
    }

    handleConnection(@ConnectedSocket() client: Socket): void {
        this.logger.debug(`${client.id} is connected...`);
    }

    @SubscribeMessage('message')
    message(@ConnectedSocket() client: Socket, @MessageBody() message: string): string {
        client.broadcast.emit('message-received', message); // broadcast to every socket except sender
        return message; // return response to (client) emit
        // socket.emit(ev, payload, (response)=> this is the value of message)
    }
}
```

### Socket Client

```
ng g service my-socket
```

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
    providedIn: 'root',
})
export class MySocketService {
    socket: Socket;

    constructor() {
        this.socket = io();
    }

    listen<T>(eventName: string): Observable<T> {
        return new Observable<T>((observer) => {
            this.socket.on(eventName, (data?: T) => {
                if (data) observer.next(data);
            });
        });
    }

    emit(eventName: string, payload: any, response?: (response: any) => any): void {
        this.socket.emit(eventName, payload, (data: any) => response(data));
        // response() is what the server is returning to the socket who did SubscribedMessage()
        // @SubscribeMessage()
        // handleMessage() {
        //     return 'this one' <--- the "data" in response(data)
        // }
    }

    // can also listen like this (hard-code)
    listenEventName<T>(): Observable<T> {
        return new Observable((observer) => {
            this.socket.on('message-received', (response) => {
                observer.next(response);
            });
        });
    }

    // can also emit like this (hard-code)
    emitEventName<T>(payload: any): void {
        this.socket.emit('message', payload);
    }

    // can also emit like this (hard-code)
    emitEventNameWithResponse<T>(response: (data: any) => any): void {
        this.socket.emit('message', payload, (data) => response(data));
    }
}
```
