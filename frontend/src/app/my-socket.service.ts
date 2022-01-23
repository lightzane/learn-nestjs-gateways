import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class MySocketService {

  socket: Socket;

  constructor() {
    // * If Server is in its own origin
    // this.socket = io();

    // ! REQUIRED when Server is on a third-party origin // (see also server/src/my.gateway.ts)
    this.socket = io('http://localhost:3000', {
      withCredentials: true,
      extraHeaders: {
        'my-custom-header': 'abcd'
      }
    });
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
}
