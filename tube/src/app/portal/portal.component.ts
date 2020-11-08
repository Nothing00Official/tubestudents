import { Component, OnInit } from '@angular/core';
import { SessionManager } from '../session.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css']
})
export class PortalComponent implements OnInit {

  iden: string;

  constructor(public session: SessionManager, public router: Router, public http: HttpClient, fb: FormBuilder) {
    this.iden = localStorage.getItem("iden");
    this.session.check().subscribe(res => {
      if (res[0] == "KO") {
        this.session.destroySession();
      }
    });
  }

  ngOnInit(): void {
  }

}
