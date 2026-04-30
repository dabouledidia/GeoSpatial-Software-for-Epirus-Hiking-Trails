import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserServices } from '../services/user.services';
import { Route, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  providers: [],
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
  this.userService.loginUser(this.userCredentials).subscribe({
    next: (response: any) => {
      localStorage.setItem('token', response.jwt);
      console.log("Login success:", response);
      alert("Login successfully");
      this.router.navigate(['main-page']); 
    },
    error: (error) => { 
      console.error("Login error:", error);
      alert("Wrong credentials");
    }
  });
}


}


