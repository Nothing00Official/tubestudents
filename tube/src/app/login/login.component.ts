import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fadeOut } from '../animations';
import { SessionManager } from '../session.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SERVER_API_URL } from '../urls';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: fadeOut
})
export class LoginComponent implements OnInit {

  iden: string;
  loading: boolean = false;
  error: string;
  spinning: boolean = false;
  form: FormGroup;
  psw: boolean = false;

  @ViewChild('loginPSW', { static: false }) loginPSW: ElementRef;

  constructor(public session: SessionManager, public router: Router, public http: HttpClient, fb: FormBuilder) {
    this.iden = localStorage.getItem("iden");
    this.session.check().subscribe(res => {
      if (res[0] == "OK") {
        if (this.iden == null) {
          this.session.destroySession();
        } else {
          this.router.navigate(['/portale']);
        }
      }
    });
    this.form = fb.group({
      'username': ['', Validators.required],
      'psw': ['', Validators.required]
    });
  }

  timeout: any = null;

  onKeyUser(event: any) {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(() => {
      this.spinning = true;
      if (event.keyCode != 13) {
        $this.checkUser(event.target.value);
      }
    }, 500);
  }

  checkUser(user) {
    this.http.get(SERVER_API_URL + "?request=CORRECT_USER&user=" + user).subscribe(res => {
      if (res["result"] == true) {
        this.psw = true;
        setTimeout(() => {
          this.loginPSW.nativeElement.focus();
        }, 100);
        this.error = null;
      } else {
        this.error = "Questo username non esiste!";
      }
      this.spinning = false;
    });
  }

  login() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.session.login(this.form.controls['username'].value, this.form.controls['psw'].value).subscribe(res => {
      if (res[0] == "KO") {
        this.error = res[1];
      } else {
        localStorage.setItem("iden", res[1]);
        this.router.navigate(['/portale']);
      }
      this.loading = false;
    });
  }

  ngOnInit(): void {
  }

}
