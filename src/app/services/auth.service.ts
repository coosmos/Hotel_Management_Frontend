import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = '/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: { username: string; password: string }) {
    return this.http.post<any>(`${this.api}/login`, payload);
  }

  handlePostLogin(token: string) {
    localStorage.setItem('token', token);
    const { roles } = this.decode(token);

    if (roles.includes('ROLE_ADMIN')) this.router.navigate(['/admin/dashboard']);
    else if (roles.includes('ROLE_MANAGER')) this.router.navigate(['/manager/dashboard']);
    else if (roles.includes('ROLE_RECEPTIONIST')) this.router.navigate(['/receptionist/dashboard']);
    else this.router.navigate(['/guest/dashboard']);
  }

  decode(token: string): any {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
