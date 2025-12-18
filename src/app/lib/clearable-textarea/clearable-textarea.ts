import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { MatFormField, MatInput, MatLabel, MatSuffix } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clearable-textarea',
  imports: [MatFormField, MatLabel, MatIcon,FormsModule,MatInput,MatIcon,MatSuffix],
  template: `
    <mat-form-field appearance="outline">
        <mat-label>{{label()}}</mat-label>
        <textarea #globalInput matInput [(ngModel)]="value" [disabled]="disabled()"></textarea>
        @if((value()?.length??0)>0 && !disabled()){
         <mat-icon matSuffix style="cursor: pointer;" (click)="value.set('')">close</mat-icon>
        }
    </mat-form-field>`,
  styleUrl: './clearable-textarea.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClearableTextarea { 
  value = model.required<string>();
  label = input.required<string>();
  disabled = input<boolean>(false);

}
