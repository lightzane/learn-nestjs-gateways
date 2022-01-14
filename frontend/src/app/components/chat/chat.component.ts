import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required]],
      topic: [undefined]
    });

    this.topic.valueChanges.subscribe((value) => {
      // value = 'foods' | 'places'
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
      // send for private room
    } else {
      // send for public
    }
    this.chatForm.markAsUntouched();
    this.message.setValue('');
  }

}
