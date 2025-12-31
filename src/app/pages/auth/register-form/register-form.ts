import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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
  @ViewChild('f') formRef!: NgForm;
  @Output() onRegisterSuccess = new EventEmitter<void>();

  constructor(private auth: AuthService) { }

  register() {
    this.loading = true;
    this.error = '';
    this.success = '';

    const payload = {
      fullName: this.form.fullName.trim(),
      username: this.form.username.trim(),
      email: this.form.email.trim(),
      password: this.form.password,
      phoneNumber: this.form.phoneNumber.trim()
    };

    console.log('Sending register payload:', payload);

    this.auth.register(payload).subscribe({
      next: (response) => {
        console.log('Register success:', response);
        this.success = 'Account created. You can now login.';
        this.loading = false;
        this.onRegisterSuccess.emit();
        this.formRef.resetForm();
      },
      error: (error) => {
        console.error('Register error details:', error);
        this.error = error.error?.message || 'Registration failed';
        this.loading = false;
      },
    });
  }
}