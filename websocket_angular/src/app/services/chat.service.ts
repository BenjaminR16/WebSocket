import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private socket: Socket = io('http://localhost:3000'); // conectamos con el servidor

    listen(eventName: string): Observable<any[]> {
        return new Observable((subscriber) => {
            const handler = (...args: any[]) => subscriber.next(args);
            this.socket.on(eventName, handler);

            // cuando nadie escuche más, quitamos el listener específico
            return () => {
                this.socket.off(eventName, handler);
            };
        });
    }

    emit(eventName: string, data?: any, target?: any) {
        this.socket.emit(eventName, data, target);
    }
}