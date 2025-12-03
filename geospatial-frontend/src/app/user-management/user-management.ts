import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserServices } from '../services/user.services';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit{

  users: User[] = [];

  constructor(private userService: UserServices, private router: Router){}

  ngOnInit(): void {
    this.getAllUsers();
  }

    getAllUsers(){
      this.userService.getAllUsers().subscribe((data: User[]) =>{
        this.users = data;
      })
    }

    deleteUser(id: number){
      this.userService.deleteUser(id).subscribe(data =>{
        this.getAllUsers();
    })
  }

}
