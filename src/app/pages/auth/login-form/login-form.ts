import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-login-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  form = { username: '', password: '' };
  loading = false;
  error = '';

  @ViewChild('usernameInput') usernameInput!: ElementRef;

  constructor(private auth: AuthService) { }

  focusUsername() {
    this.usernameInput.nativeElement.focus();
  }

  login() {
    this.loading = true;
    this.error = '';

    this.auth.login(this.form).subscribe({
      next: (response) => {
        this.auth.handlePostLogin(response);
      },
      error: (error) => {
        this.error = error.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}