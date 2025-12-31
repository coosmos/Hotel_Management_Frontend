import { Component, ViewChild } from '@angular/core';
import { LoginForm } from "../login-form/login-form";
import { RegisterForm } from "../register-form/register-form";

@Component({
  selector: 'app-auth-page',
  imports: [LoginForm, RegisterForm],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css',
})
export class AuthPage {
  @ViewChild(LoginForm) loginForm!: LoginForm;

  onRegisterSuccess() {
    this.loginForm.focusUsername();
  }
}
