import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class UserServices{
    
    private apiUrl = environment.apiUrl + '/';    
    constructor(private http: HttpClient){}

    loginUser(userCredentials: FormGroup): Observable<any> {
        return this.http.post(this.apiUrl + "login", userCredentials.value)
    }

    register(userRegister: FormGroup) {
        this.http.post(this.apiUrl + "register", userRegister.value)
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

    getRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    return decoded.roles?.[0] || null;
    }

        getUser(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    return decoded.sub || null;
    }

    getAllUsers(): Observable<any>{
        const token = localStorage.getItem('token');

        return this.http.get<any[]>(this.apiUrl + "all_users",{
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
        });
    }

    deleteUser(id: number): Observable<Object>{
        const token = localStorage.getItem('token');
        return this.http.delete(this.apiUrl+ "deleteUser/"+ id,{
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
        });
    }
}
