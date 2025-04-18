import { ChangeDetectionStrategy, Component, computed, inject, input, model, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormField, MatInputModule, MatLabel} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import { LlmApiService } from '../services/llm-api.service';
import { ChatMessage } from '../models/message.class';
import { MatIconModule } from '@angular/material/icon';
import { ChatSession } from '../models/chat-session.class';

@Component({
  selector: 'app-chat',
  imports: [MatCardModule,MatInputModule,FormsModule,MatListModule,MatButtonModule,MatLabel,MatFormField,MatIconModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {
  private readonly llmApiService = inject(LlmApiService);
  chatSession = input.required<ChatSession>();
  closeChat = output<ChatSession>();


  messages = signal<ChatMessage[]>([]);
  hasMessages = computed<boolean>(()=>this.messages().length>0);
  userInput = model<string>("");
  speed = signal<number>(0);

  isUserInputValid = computed<boolean>(()=> !!this.userInput() && this.userInput().trim().length>0);
  
  
  ngOnInit(): void {
      this.llmApiService.globalMessage$.subscribe((newMessage)=>{
        this.sendMessage(newMessage);
      })
  }
  
  sendMessage(message:string):void{
    if(!message || message.trim().length === 0){
     return;
    }
    
    this.messages.update((list)=>{
      list.push({role:'user',content:message});
     
      return list;

    });
    const session = this.chatSession();
    this.llmApiService.sendChatMessages(this.messages(),session.provider,session.model).subscribe(res=>{
      this.messages.update((list)=>
        [...list,res.choices[res.choices.length-1].message]
      );
      
    });
    this.userInput.set('');
  
  }

  clear():void {
    this.userInput.set('');
    this.messages.set([]);
  }

  close():void{
    this.closeChat.emit(this.chatSession());
  }

 }
