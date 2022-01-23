import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MySocketService } from '../../my-socket.service';

interface Message {
  name: string,
  message: string;
  topic?: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Input() title: string;
  @Input() subtitle: string;
  @Input() isPrivate: boolean = false;
  @Input() myName: string = 'Anonymous';

  chatForm: FormGroup;
  receivedMessages: string[] = [];
  privateReceivedMessages: string[] = [];

  constructor(private mySocketService: MySocketService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required]],
      topic: [undefined]
    });

    this.topic.valueChanges.subscribe((value) => {
      this.mySocketService.emit('join-room', value);
    });

    // Socket On: message-received
    this.mySocketService.listen<Message>('message-received').subscribe((msg) => {
      this.receivedMessages.splice(0, 0, `[${msg.name}] ` + msg.message);
    });

    // Socket On: room-message-received
    this.mySocketService.listen<Message>('room-message-received').subscribe((msg) => {
      this.privateReceivedMessages.splice(0, 0, `[${msg.name}] ` + msg.message);
    });
  }

  get message(): AbstractControl {
    return this.chatForm.get('message');
  }

  get topic(): AbstractControl {
    return this.chatForm.get('topic');
  }

  sendMessage(isPrivate: boolean): void {
    if (isPrivate) {

      this.mySocketService.emit('message-room', {
        message: this.message.value,
        topic: this.topic.value,
        name: this.myName
      }, (response) => {
        this.privateReceivedMessages.splice(0, 0, '[YOU] ' + response);
      });

    } else {
      this.mySocketService.emit('message', {
        message: this.message.value,
        name: this.myName
      }, (response) => {
        this.receivedMessages.splice(0, 0, '[YOU] ' + response);
      });
    }
    this.chatForm.markAsUntouched();
    this.message.setValue('');
  }

}
