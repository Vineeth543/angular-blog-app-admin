import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  onSubmit(data: { email: string; password: string }): void {
    this.authService.login(data.email, data.password);
  }
}
