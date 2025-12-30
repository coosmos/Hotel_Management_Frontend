import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:9090/api/auth';

  constructor(private http: HttpClient, private router: Router) { }

  login(payload: { username: string; password: string }) {
    return this.http.post<any>(`${this.api}/login`, payload);
  }
  register(payload: any) {
    return this.http.post<any>(`${this.api}/register`, payload);
  }

  handlePostLogin(response: any) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    const role = response.user.role;
    switch (role) {
      case 'ADMIN':
        console.log('admin');
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'MANAGER':
        console.log('manager');
        this.router.navigate(['/manager/dashboard']);
        break;
      case 'RECEPTIONIST':
        this.router.navigate(['/receptionist/dashboard']);
        break;
      default:
        this.router.navigate(['/guest/dashboard']);
    }
  }
}
