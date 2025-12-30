import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../../services/user-store';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule,FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(
    private userStore: UserStore,
    private router: Router
  ) { }

  get user() {
    return this.userStore.getUser();
  }
  logout() {
    this.userStore.clear();
    this.router.navigate(['/']);
  }
}
