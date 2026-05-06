import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserServices } from '../services/user.services';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule],
  providers: [],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  userRegister = new FormGroup({
    email: new FormControl(''),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    password: new FormControl('')
  })

  constructor(private userService: UserServices, private router: Router){

  }

  register(): void {  
  this.userService.register(this.userRegister)
  this.router.navigate(["/login"]);
  };

}

