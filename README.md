# Learn NestJs Gateways

<p>
    <img src="https://img.shields.io/badge/-nestjs-red">
    <img src="https://img.shields.io/badge/-socket.io-white">
</p>

Learn [socket.io](https://socket.io/) using [NestJs](https://nestjs.com/)<br>
This is how `chat` works! Realtime.

```
npm i @nestjs/websockets @nestjs/platform-socket.io
npm i -D @types/socket.io@2.1.13
```

**WARNING**

`@nestjs/platform-socket.io` currently depends on `socket.io v2.3`<br>
`@types/socket.io` might install `v3.0` or higher, it has deprecated `@types` so use `v2.1.13` instead

## Get the Socket client in the node_modules

After installation, look for the `node_modules/socket.io-client/dist/socket.io.js`<br>
Copy that `js` file and paste near your `index.html` or client<br>
Import script in your `html` in `head` or `body`

```html
<script src="socket.io.js"></script>
```

## Write your socket code for Client

```html
<script>
    // Get Socket.io
    const socket = io('http://localhost:3000');

    // Socket: connect (predefined)
    socket.on('connect', () => {
        console.log('Connected');
    });

    // Argument 1 = event name
    // Argument 2 = data: any
    // Argument 3 = response from nestjs
    socket.emit('msg', 'hello socket', (res) => {
        // this 3rd argument is optional
        // unless nestjs has "return data"
        // then "data" will be stored in "res"
    });

    socket.on('someoneDisconnected', (res) => {
        console.log(res); // from nestjs
    });
</script>
```

## Write you socket code for Server

```
nest generate gateway <your_gateway>
```

**chat.gateway.ts**

```ts
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayDisconnect {
    @WebSocketServer()
    io: Server;

    @SubscribeMessage('msg')
    handleMessage(@MessageBody() data: string): string {
        // send to everyone
        this.io.emit('msg', data);

        // return data TO SENDER ONLY
        return data;
    }

    // implements OnGatewayDisconnect
    handleDisconnect(@ConnectedSocket() client: Socket) {
        // broadcast to everyone (except sender)
        client.broadcast.emit('someoneDisconnected', client.id);
    }
}
```

## Trying out this Project

1. Open `cli` in `server` folder
2. `npm install`
3. `npm run start`
4. Directly open the `index.html` by double-clicking on it
5. Open again the `index.html` to create 2 tabs or 2 browsers

    Opening the `index.html` does not need a server.<br>
    **BUT** needs the nestjs server running in `http://localhost:3000`

## References

-   https://docs.nestjs.com/websockets/gateways
-   https://socket.io/docs/v2/emit-cheatsheet/index.html
