import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';


@Injectable({
    providedIn: 'root',
})
export class ChatService {
    socket = io('http://localhost:3000');

    // Escuchar eventos del servidor con un observable
    listen(eventName: string): Observable<any> {
        return new Observable((subscriber) => {
            this.socket.on(eventName, (data) => {
                subscriber.next(data);
            });
        });
    }

    // Enviar eventos al servidor
    emit(eventName: string, data: any, target: string) {
        this.socket.emit(eventName, data);
    }
}