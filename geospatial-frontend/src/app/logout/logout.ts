import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserServices } from '../services/user.services';

@Component({
  selector: 'app-logout',
  imports: [ReactiveFormsModule, RouterModule],
  providers: [],
  templateUrl: './logout.html',
  styleUrl: './logout.css',
})
export class Logout {
  constructor(private userService: UserServices, private router: Router){

  }

  logout(): void {
  this.userService.logout();
  alert("You have been logged out.");
  this.router.navigate(['/login']);
}


}
