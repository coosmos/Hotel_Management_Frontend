import { Injectable } from '@angular/core';
import{ Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class UserStore {
  constructor(private router:Router){}
  getUser(){
    const user=localStorage.getItem('user');
    return user?JSON.parse(user):null;
  }
  isLoggedIn(){
    const user=localStorage.getItem('user');
    return !!user;
  }
  clear(){
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
  //logout()


}
