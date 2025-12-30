import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-login-form',
  imports: [FormsModule,CommonModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  form = { username: '', password: '' };
  loading = false;
  error = '';

  constructor(private auth: AuthService) {}

  login() {
    this.loading = true;
    this.error = '';

    this.auth.login(this.form).subscribe({
      next: (res) => {
        this.auth.handlePostLogin(res);
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}