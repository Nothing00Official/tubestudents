import { Component, OnInit } from '@angular/core';
import { fadeOut } from '../animations';
import { SessionManager } from '../session.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css'],
  animations: fadeOut
})
export class SupportComponent implements OnInit {

  iden: string;

  constructor(public session: SessionManager, public router: Router, public http: HttpClient) {
    this.iden = localStorage.getItem("iden");
    this.session.check().subscribe(res => {
      if (res[0] == "OK") {
        if (this.iden == null) {
          this.session.destroySession();
        } else {
          this.router.navigate(['/portale']);
        }
      }
    })
  }

  ngOnInit(): void {
  }

}
