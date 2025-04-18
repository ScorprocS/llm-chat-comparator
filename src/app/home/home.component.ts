import { LlmApiService } from './../services/llm-api.service';
import { ChangeDetectionStrategy, Component, inject, signal, model, computed } from '@angular/core';
import { ChatComponent } from "../chat/chat.component";
import { UserConfigService } from '../services/user-config.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChatSession } from '../models/chat-session.class';
import { v4 as uuidv4 } from 'uuid';
import { LLMProvider } from '../models/provider.class';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-home',
  imports: [ChatComponent,MatButtonModule,MatIconModule,FormsModule,MatFormField,MatLabel,MatInputModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent { 

  private readonly configService = inject(UserConfigService);
  private readonly llmApiService = inject(LlmApiService);

  chatSessions = signal<ChatSession[]>([]);
  globaluserInput = model<string>("");

  globaluserInputValid = computed<boolean>(()=>{
    const input = this.globaluserInput();
    return !!input && input.trim().length>0;
  });

  openAddChatSessionDialog(): void{
 /*   let session:ChatSession = {
      id:uuidv4(),
      provider:provider,
      model:model,
    };
    this.chatSessions.update((sessions)=> [...sessions,session]);
*/
    this.addChatSession(this.configService.providers[1],this.configService.providers[1].models[0]);
  }


  addChatSession(provider:LLMProvider,model:string): void{
    let session:ChatSession = {
      id:uuidv4(),
      provider:provider,
      model:model,
    };
    this.chatSessions.update((sessions)=> [...sessions,session]);
  }

  sendMessageToAll():void {
    if(!this.globaluserInputValid()){
      return;
    }

    this.llmApiService.sendGlobalMessage(this.globaluserInput());

    this.globaluserInput.set('');

  }
  removeChatSession(session:ChatSession):void{
    this.chatSessions.update((sessions)=>{
      const index = sessions.findIndex((e)=>e.id === session.id, 0);
      let newSessions = [...sessions];
      if(index>-1){
        newSessions.splice(index,1);
      }
      return newSessions;

    });
  }
}
