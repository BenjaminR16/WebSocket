import { Component, inject, signal } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  private socket = inject(ChatService)

  messages = signal('')
  myIdElement = signal('')
  targetSelect = signal('')
  myId = ""

  selectControl = new FormControl('');

  usuarios: { id: any; nombre: any }[] = [];

  formulario = new FormGroup({
    chat: new FormControl('')
  })

  updateUserList(users: string[]) {
    this.usuarios = users
      .filter(user => user !== this.myId)
      .map((user, index) => ({
        id: index,      // o usa el string si quieres
        nombre: user
      }));
  }

  enviar() {

  }


}
