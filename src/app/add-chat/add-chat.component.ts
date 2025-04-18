import { UserConfigService } from './../services/user-config.service';
import { LLMProvider } from './../models/provider.class';
import { ChangeDetectionStrategy, Component, computed, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ChatSession } from '../models/chat-session.class';

@Component({
  selector: 'app-add-chat',
  imports: [FormsModule,MatButtonModule,MatFormField,MatSelectModule,MatDialogActions,MatDialogClose,
    MatDialogContent,
    MatDialogTitle,],
  template: `<div>
   <h2 mat-dialog-title>New chat session</h2>
    <mat-dialog-content>
    <form #chatForm="ngForm">
      <mat-form-field>
        <mat-label>Provider</mat-label>
        <mat-select [(ngModel)]="selectedProvider">
          @for (p of providers(); track p.name) {
            <mat-option [value]="p">{{p.name}}</mat-option>
          }
        </mat-select>
      </mat-form-field>

    </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]>Close</button>
      <button mat-raised-button type="submit" [disabled]="chatForm.valid" [mat-dialog-close]="buildChatSession()">Create</button>
    </mat-dialog-actions>
      </div>`,
  styleUrl: './add-chat.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddChatComponent { 

  private readonly userConfig = inject(UserConfigService);
  protected readonly providers = signal<LLMProvider[]>(this.userConfig.providers);
  public readonly selectedProvider = model<LLMProvider>();
  public readonly selectedModel = model<string>();

  buildChatSession():Partial<ChatSession>{
    return {
      model: this.selectedModel(),
      provider:this.selectedProvider()
    };
  }
}
