import { LlmApiService } from './../services/llm-api.service';
import { ChangeDetectionStrategy, Component, inject, signal, model, computed } from '@angular/core';
import { ChatComponent } from "../chat/chat.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChatSession } from '../models/chat-session.class';
import { v4 as uuidv4 } from 'uuid';
import { LLMProvider } from '../models/provider.class';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { AddChatDialogComponent } from '../add-chat-dialog/add-chat-dialog.component';

@Component({
  selector: 'app-home',
  imports: [ChatComponent,MatButtonModule,MatIconModule,FormsModule,MatFormField,MatLabel,MatInputModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent { 

  private readonly llmApiService = inject(LlmApiService);
  readonly dialog = inject(MatDialog);


  chatSessions = signal<ChatSession[]>([]);
  globaluserInput = model<string>("");

  globaluserInputValid = computed<boolean>(()=>{
    const input = this.globaluserInput();
    return !!input && input.trim().length>0;
  });

  openAddChatSessionDialog(): void{
    const dialogRef = this.dialog.open(AddChatDialogComponent);

    dialogRef.afterClosed().subscribe((result:Partial<ChatSession>) => {
      if (result !== undefined && result.provider && result.model) {
        this.addChatSession(result.provider,result.model);
      }
    });
  }


  addChatSession(provider:LLMProvider,model:string): void{
    const session:ChatSession = {
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
      const newSessions = [...sessions];
      if(index>-1){
        newSessions.splice(index,1);
      }
      return newSessions;

    });
  }
}
