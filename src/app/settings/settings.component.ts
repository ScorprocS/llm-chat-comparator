import { UserConfigService } from './../services/user-config.service';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { LLMProvider } from '../models/provider.class';
import {MatTableModule} from '@angular/material/table';
import {MatChipsModule} from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ProviderFormDialog } from '../provider-form/provider-form.component';

@Component({
  selector: 'app-settings',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  MatTableModule,
MatChipsModule],
  templateUrl:'./settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent { 

   dialog = inject(MatDialog);
   userConfigService =  inject(UserConfigService);

   providers = this.userConfigService.providers;

/*
  providers = signal<LLMProvider[]>([
    {
      name: 'OpenAI',
      chatUrl: 'https://api.openai.com/v1',
      apiKey: 'sk-...', 
      models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo']
    },
    {
      name: 'Anthropic',
      chatUrl: 'https://api.anthropic.com/v1',
      apiKey: 'ant-...', 
      models: ['claude-3-5-sonnet', 'claude-3-opus']
    },
    {
      name: 'Local Ollama',
      chatUrl: 'http://localhost:11434/v1',
      apiKey: 'none',
      models: ['llama3', 'mistral', 'phi3']
    }
  ]);*/

  // Colonnes affichées (on exclut explicitement 'apiKey')
  displayedColumns: string[] = ['name', 'chatUrl', 'models', 'actions'];

  editProvider(index:number,provider: LLMProvider):void {
     const dialog = this.dialog.open(ProviderFormDialog, {
      data: {...provider,id:index},
    });

    dialog.afterClosed().subscribe((res:LLMProvider)=>{
      if(res){
        this.providers.update((providers=>[
            ...providers.slice(0, index),
            res,
            ...providers.slice(index + 1)
          ]));
      }
      

    });
  }

  deleteProvider(provider: LLMProvider):void {
    this.providers.update(prev => prev.filter(p => p !== provider));
  }

  addProvider():void{
    const dialog = this.dialog.open(ProviderFormDialog, {
      data: null,
    });

    dialog.afterClosed().subscribe((res:LLMProvider)=>{
      if(res)
        this.providers.update((providers)=>[...providers,res])
    });
  }

  
}
