import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MySocketService } from '../../my-socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Input() title: string;
  @Input() subtitle: string;
  @Input() isPrivate: boolean = false;

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
    this.mySocketService.listen<string>('message-received').subscribe((msg) => {
      this.receivedMessages.splice(0, 0, '[THEM] ' + msg);
    });

    // Socket On: room-message-received
    this.mySocketService.listen<string>('room-message-received').subscribe((msg) => {
      this.privateReceivedMessages.splice(0, 0, '[THEM] ' + msg);
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
        topic: this.topic.value
      }, (response) => {
        this.privateReceivedMessages.splice(0, 0, '[YOU] ' + response);
      });

    } else {
      this.mySocketService.emit('message', this.message.value, (response) => {
        this.receivedMessages.splice(0, 0, '[YOU] ' + response);
      });
    }
    this.chatForm.markAsUntouched();
    this.message.setValue('');
  }

}
