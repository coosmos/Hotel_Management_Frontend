import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  form = {
    fullName: '',
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
  };

  loading = false;
  error = '';
  success = '';

  constructor(private auth: AuthService) { }

  register() {
    this.loading = true;
    this.error = '';
    this.success = '';

    this.auth.register(this.form).subscribe({
      next: (response) => {
        this.success = 'Account created. You can now login.';
        this.loading = false;
        this.form = {
          fullName: '',
          username: '',
          email: '',
          password: '',
          phoneNumber: '',
        };
      },
      error: (error) => {
        this.error = error.error?.message || 'Registration failed';
        this.loading = false;
      },
    });
  }
}
