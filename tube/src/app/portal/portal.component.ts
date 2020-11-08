import { Component, OnInit } from '@angular/core';
import { SessionManager } from '../session.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user.model';
import { fadeOut } from '../animations';
import { SERVER_API_URL } from '../urls';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css'],
  animations: fadeOut
})
export class PortalComponent implements OnInit {

  iden: string;
  loading: boolean = false;
  user: User;
  pswForm: FormGroup;
  error: string;

  constructor(public session: SessionManager, public router: Router, public http: HttpClient, fb: FormBuilder) {
    this.iden = localStorage.getItem("iden");
    this.session.check().subscribe(res => {
      if (res[0] == "KO") {
        this.session.destroySession();
      } else {
        this.loading = true;
        this.session.loadUser().subscribe(res => {
          this.user = res;
          this.loading = false;
        })
      }
    });
    this.pswForm = fb.group({
      'psw': ['', Validators.required],
      'rpsw': ['', Validators.required]
    })
  }

  checkPsw() {
    let psw = this.pswForm.controls['psw'].value;
    let rpsw = this.pswForm.controls['rpsw'].value;
    if (psw != rpsw) {
      this.error = "Le password inserite non corrispondono";
      return false;
    }
    if (psw.length < 8 || psw.length > 16) {
      this.error = "La password deve contenere un numero di caratteri compresi tra gli 8 e 16";
      return false;
    }
    return true;
  }

  sendPassword() {
    if (this.pswForm.invalid || !this.checkPsw()) {
      return;
    }
    this.loading = true;
    this.http.post(SERVER_API_URL, {
      request: "SETPASSWORD",
      session: true,
      id: this.iden,
      psw: this.pswForm.controls['psw'].value
    }).subscribe(res => {
      if (res[0] == "KO") {
        this.error = res[1];
      } else {
        this.user.active = true;
      }
      this.loading = false;
    })
  }

  ngOnInit(): void {
  }


}
