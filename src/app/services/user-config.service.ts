import { Injectable } from '@angular/core';
import { LLMProvider } from '../models/provider.class';

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {
  providers:LLMProvider[] = [{
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

}
