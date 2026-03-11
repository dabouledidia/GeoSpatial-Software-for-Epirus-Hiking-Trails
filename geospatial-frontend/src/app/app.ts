import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { UserServices } from './services/user.services';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule, MenubarModule, AvatarModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('geospatial-frontend');

  constructor(public userService: UserServices) {}

  
  logout() {
    this.userService.logout();
  }

  getRole(){
    return this.userService.getRole();
  }

  getUsername(){
    return this.userService.getUser();
  }
}
