import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-config',
  imports: [],
  template: `<p>user-config works!</p>`,
  styleUrl: './user-config.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserConfig { }
