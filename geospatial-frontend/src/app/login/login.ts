import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserServices } from '../services/user.services';
import { Route, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  providers: [UserServices],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  userCredentials = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  constructor(private userService: UserServices, private router: Router){

  }

  login(): void {  
  this.userService.loginUser(this.userCredentials)
  };

}
