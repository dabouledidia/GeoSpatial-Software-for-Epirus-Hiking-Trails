import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserServices{
    
    private apiUrl = 'http://localhost:8080';

    constructor(private http: HttpClient){}

    loginUser(userCredentials: FormGroup): Observable<any> {
        return this.http.post(this.apiUrl + "/login", userCredentials.value)
    }

    register(userRegister: FormGroup) {
        this.http.post(this.apiUrl + "/register", userRegister.value)
            .subscribe({
            next: (res: any) => {
                console.log(res.body);   
                alert(JSON.stringify(res.body));
            },
            error: (err) => {
                console.error(err);
                alert("Error");
            }
            });
    }

    logout(): void {
        localStorage.removeItem('token');
        console.log("Token removed. Current value:", localStorage.getItem('token'));
    }

    isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
