import { effect, inject, Injectable, signal } from '@angular/core';
import { LLMProvider } from '../models/provider.class';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {
  private storage = inject(StorageService);
  private static key = 'providers';
  readonly providers = signal<LLMProvider[]>([]);

  private providersEffect = effect(()=>{
    const providers = this.providers();
    this.storage.setItemObject<LLMProvider[]>(UserConfigService.key,providers);
  });

  private static providersDefault:LLMProvider[] = [{
    name:'mistral',
    apiKey:'apiKey',
    chatUrl:'https://api.mistral.ai/v1/chat/completions',
    models:['mistral-small-2506','mistral-medium-2508','mistral-large-2512','magistral-small-2509','codestral-2508','devstral-2512'],
  },
  {
    name:'openai',
    apiKey:'apiKey',
    chatUrl:'https://api.openai.com/v1/chat/completions',
    models:['gpt-5-nano','gpt-5-mini','gpt-5.2','gpt-5.1-codex-mini','gpt-5.1-codex-max'],
  }];


  public loadConfigFromStorage():void {
    if(this.providers()?.length>0){
      return;
    }
    const providers = this.storage.getItemObject<LLMProvider[]>(UserConfigService.key);
    if(providers && providers.length>0){
      this.providers.set(providers);
    }else{
     this.providers.set(UserConfigService.providersDefault);
    }
    
  }
}
