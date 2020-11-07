import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from './urls'
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionManager {

  constructor(private http: HttpClient) {

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
        window.location.replace("/");
      }
    });
  }
}
