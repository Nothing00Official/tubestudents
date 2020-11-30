import { Component, OnInit } from '@angular/core';
import { fadeOut } from '../animations';
import { SessionManager } from '../session.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '../urls';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  animations: fadeOut
})
export class IndexComponent implements OnInit {

  iden: string;

  stats: Object;

  constructor(public session: SessionManager, public router: Router, public http: HttpClient) {
    this.iden = localStorage.getItem("iden");
    this.loadCounters();
    this.session.check().subscribe(res => {
      if (res[0] == "OK") {
        if (this.iden == null) {
          this.session.destroySession();
        } else {
          this.router.navigate(['/portale']);
        }
      }
    });
  }

  loadCounters() {
    this.http.get(SERVER_API_URL + "?request=STATS").subscribe(res => { 
      this.stats = res;
    });
  }

  ngOnInit(): void {
  }

  goDonation(value) {
    window.open("https://www.unidea.org/it/donation/" + value, "_blank");
  }

}
