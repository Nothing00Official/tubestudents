import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from './urls'
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SessionManager {

  constructor(private http: HttpClient, public router: Router) {

  }

  public loadUser() {
    return this.http.post<User>(SERVER_API_URL, {
      request: "USER_MODEL",
      session: true,
      id: localStorage.getItem("iden")
    })
  }

  public check() {
    return this.http.post(SERVER_API_URL, {
      request: "check",
      session: true
    })
  }

  public login(user, psw) {
    return this.http.post(SERVER_API_URL, {
      request: "login",
      session: true,
      username: user,
      password: psw
    })
  }

  public destroySession(): void {
    this.http.post(SERVER_API_URL, {
      request: "logout",
      session: true
    }).subscribe(res => {
      if (res[0] == "KO") {
        alert(res[1]);
      } else {
        localStorage.removeItem('iden');
        this.router.navigate(['/login']);
      }
    });
  }
}
