import { inject, Injectable } from '@angular/core';
import { LLMProvider } from '../models/provider.class';
import { HttpClient } from '@angular/common/http';
import { ChatMessage } from '../models/message.class';
import { Observable, Subject } from 'rxjs';
import { LlmResponse } from '../models/response.class';

@Injectable({
  providedIn: 'root'
})
export class LlmApiService {
  private readonly http = inject(HttpClient);

  private globalMessageSubject: Subject<string> = new Subject<string>();
  public readonly globalMessage$ = this.globalMessageSubject.asObservable();

  
  sendChatMessages(messages:ChatMessage[],provider:LLMProvider,model:string,temperature=0.5):Observable<LlmResponse>{
    return this.http.post<LlmResponse>(provider.chatUrl,{    
        model: model,
        messages: messages,
        temperature:temperature,
        stream: false,
    },{
      headers:{
        'Content-Type':'application/json',
        'Authorization': 'Bearer '+provider.apiKey
      }
    }); 

  }

  sendGlobalMessage(message:string){
    this.globalMessageSubject.next(message);

  }

}
