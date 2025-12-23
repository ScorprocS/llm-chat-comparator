import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { LLMProvider } from '../models/provider.class';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef, MatDialogClose } from "@angular/material/dialog";



@Component({
  selector: 'app-provider-form',
  imports: [ReactiveFormsModule, MatInput, MatFormField, MatLabel, MatError, MatIcon, MatDivider, MatButton, MatIconButton, MatDialogContent, MatDialogActions,MatDialogClose],
  templateUrl: './provider-form.component.html',
  styleUrl: './provider-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderFormDialog implements OnInit{
  readonly dialogRef = inject(MatDialogRef<ProviderFormDialog>);


  private fb = inject(FormBuilder);
  private data = inject<LLMProvider>(MAT_DIALOG_DATA)

 createModelForm(item:string):FormControl{
    return this.fb.control(item, [Validators.required,Validators.minLength(3)]);
  }


  form = this.fb.group({
    name: ['', [Validators.required,Validators.minLength(5)]],
    chatUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
    apiKey: ['', [Validators.required]],
    models: this.fb.array([])
  });

 

  ngOnInit(): void {
    if(this.data ){
      console.log(this.data.models)
      this.form.setValue(  {
          name: this.data.name,
          chatUrl: this.data.chatUrl,
          apiKey: this.data.apiKey,
          models: []
        });
      this.models.clear();
      this.data.models.forEach(item => {
        console.log("ici")
        this.models.push(this.createModelForm(item));
      });
    }
  
  } 

  get models() {
    return this.form.get('models') as FormArray<FormControl<string | null>>;
  }

  addModel(): void {
    this.models.push(this.createModelForm(''));
  }

  removeModel(index: number): void {
    if (this.models.length > 1) {
      this.models.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const providerData = this.form.getRawValue() as LLMProvider;
      console.log('Provider Data:', providerData);
      this.dialogRef.close(providerData);
    }
  }
  
}
