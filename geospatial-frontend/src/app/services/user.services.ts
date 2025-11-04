import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class UserServices{
    
    private apiUrl = 'http://localhost:8080';

    constructor(private http: HttpClient){}

        loginUser(userCredentials: FormGroup){
        this.http.post(this.apiUrl + "/login", userCredentials.value).subscribe({
    next: (response: any) => {
        localStorage.setItem('token', response.jwt);
        console.log("Login success:", response);
        alert("Login successfully");
    },
    error: (error) => {
        console.error("Login error:", error);
        alert("Wrong credentials");
    }
    });
        }

    register(userRegister: FormGroup){
        this.http.post(this.apiUrl + "/register", userRegister.value).subscribe((userRegister:any)=>{
            alert("registered!")
    }, error =>{
        console.log(error);
    })
    }
}
