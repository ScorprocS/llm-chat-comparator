import { Usage } from './../models/response.class';
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
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [MatCardModule,MatInputModule,FormsModule,MatListModule,MatButtonModule,MatLabel,MatFormField,MatIconModule,DecimalPipe],
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
  usages = signal<Usage[]>([]);
  speedAvg = computed<number>(()=>{
    const usages = this.usages();
    if(usages.length === 0){
        return 0;
    }
    let someSpeed = 0;
    usages.forEach(u=>{
      someSpeed += u.total_tokens/(u.time/1000);
    })

    return someSpeed / usages.length;

  });

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
    const startTime = performance.now();
    

    this.llmApiService.sendChatMessages(this.messages(),session.provider,session.model).subscribe(res=>{
      const duration = performance.now() - startTime;
      this.messages.update((list)=>
        [...list,res.choices[res.choices.length-1].message]
      );
     
      this.usages.update((list)=>
        [...list,{...res.usage,time:duration}]
      );
      
    });
    this.userInput.set('');
  
  }

  clear():void {
    this.userInput.set('');
    this.messages.set([]);
    this.usages.set([]);
  }

  close():void{
    this.closeChat.emit(this.chatSession());
  }

 }
