import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent {
  onSubmit(data: { email: string; password: string }): void {
    console.log(data);
  }
}
