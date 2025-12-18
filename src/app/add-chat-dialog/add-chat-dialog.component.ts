import { UserConfigService } from '../services/user-config.service';
import { LLMProvider } from '../models/provider.class';
import { ChangeDetectionStrategy, Component, computed, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ChatSession } from '../models/chat-session.class';


@Component({
  selector: 'app-add-chat',
  imports: [FormsModule, MatButtonModule, MatFormField, MatSelectModule, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle],
  template: `<div>
   <h2 mat-dialog-title>New chat session</h2>
    <mat-dialog-content>
    <form #chatForm="ngForm">
      <mat-form-field>
        <mat-label>Provider</mat-label>
        <mat-select name="selectProvider" [(ngModel)]="selectedProvider" required>
          @for (p of this.userConfig.providers(); track p.name) {
            <mat-option [value]="p">{{p.name}}</mat-option>
          }
        </mat-select>
      </mat-form-field>

     @if(selectedProvider(); as sp){
        <mat-form-field>
          <mat-label>Model</mat-label>
          <mat-select name="selectModel" [(ngModel)]="selectedModel" required>
            @for (m of sp.models; track m) {
              <mat-option [value]="m">{{m}}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      }     

    </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]>Close</button>
      <button mat-raised-button type="submit" [disabled]="!chatForm.valid || !isValid()" [mat-dialog-close]="buildChatSession()">Create</button>
    </mat-dialog-actions>
      </div>`,
  styleUrl: './add-chat-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddChatDialogComponent { 

  protected readonly userConfig = inject(UserConfigService);
  protected readonly selectedProvider = model<LLMProvider>();
  protected readonly selectedModel = model<string>();

  protected readonly isValid = computed<boolean>(()=>{
    const provider = this.selectedProvider();
    const model = this.selectedModel();
    return !!provider && !!model && provider.models.includes(model); 
  
  });

  buildChatSession():Partial<ChatSession>{
    return {
      model: this.selectedModel(),
      provider:this.selectedProvider()
    };
  }
}
