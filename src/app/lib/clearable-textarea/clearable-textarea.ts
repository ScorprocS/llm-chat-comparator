import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { MatFormField, MatInput, MatLabel, MatSuffix } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clearable-input',
  imports: [MatFormField, MatLabel, MatIcon,FormsModule,MatInput,MatIcon,MatSuffix],
  template: `
    <mat-form-field appearance="outline">
        <mat-label>{{label()}}</mat-label>
        @if(inputType() === 'textarea'){
          <textarea matInput [(ngModel)]="value" [disabled]="disabled()"></textarea>
        }@else {
          <input matInput [(ngModel)]="value" [disabled]="disabled()" type="text" />
        }
        
        @if((value()?.length??0)>0 && !disabled()){
         <mat-icon matSuffix style="cursor: pointer;" (click)="value.set('')">close</mat-icon>
        }
    </mat-form-field>`,
  styleUrl: './clearable-textarea.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClearableInput { 
  value = model.required<string>();
  label = input.required<string>();
  disabled = input<boolean>(false);
  inputType = input<'textarea'|'text'>('text');

}
