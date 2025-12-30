import { Component } from '@angular/core';
import { LoginForm } from "../login-form/login-form";

@Component({
  selector: 'app-auth-page',
  imports: [LoginForm],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css',
})
export class AuthPage {

}
