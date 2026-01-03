import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');
    if (!token) return next.handle(request);

    return next.handle(
      request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    );
  }
}
