import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

interface Usuario {
  id: string;
  nombre: string;
}

@Component({
  selector: 'app-chat',
  imports: [ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy {
  private chatService = inject(ChatService);

  myId = signal('');
  mensajes = signal<string[]>([]);
  usuarios = signal<Usuario[]>([]);

  selectControl = new FormControl('');

  formulario = new FormGroup({
    chat: new FormControl(''),
  });

  private subs: Subscription[] = [];

  ngOnInit() {
    this.subs.push(
      this.chatService.listen('me').subscribe(([id]) => {
        this.myId.set(id); // guardamos nuestro id
      }),

      this.chatService.listen('users').subscribe(([users]) => {
        this.updateUserList(users); // actualizamos la lista de amigos conectados
      }),

      this.chatService.listen('chat message').subscribe(([msg, fromId, toId]) => {
        if (toId === this.myId() || fromId === this.myId()) {
          const prefix = fromId === this.myId() ? `Yo -> ${toId}` : `${fromId} -> mensaje`;
          this.mensajes.update((msgs) => msgs.concat(`${prefix}: ${msg}`));
        }
      }),

      this.chatService.listen('chat error').subscribe(([errorMessage]) => {
        this.mensajes.update((msgs) => msgs.concat(`Error: ${errorMessage}`));
      })
    );
  }

  //ver para que es 
  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }

  updateUserList(users: string[]) {
    const selectedValue = this.selectControl.value; // guardamos a quién teníamos seleccionado

    this.usuarios.set(
      users
        .filter((user) => user !== this.myId()) // quitamos nuestro propio id
        .map((user) => ({ id: user, nombre: user })) // usamos el id REAL, no el índice
    );

    if (selectedValue && users.includes(selectedValue)) {
      this.selectControl.setValue(selectedValue); // si antes teníamos uno elegido, lo dejamos
    }
  }

  pedirUsuarios() {
    this.chatService.emit('request users'); // cuando abrimos el select, pedimos la lista
  }

  enviar() {
    const targetId = this.selectControl.value;
    const msg = this.formulario.get('chat')?.value;

    if (!targetId) {
      this.mensajes.update((msgs) => msgs.concat('Selecciona un usuario para chatear.'));
      return;
    }

    if (msg) {
      this.chatService.emit('chat message', msg, targetId);
      this.formulario.get('chat')?.setValue('');
    }
  }
}