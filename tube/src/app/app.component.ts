import { Component, HostListener, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from "@angular/common";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { fadeOut } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'tube';

  iden: string;

  loading: boolean = false;

  constructor(public router: Router, public loc: Location, public http: HttpClient) {
    this.iden = localStorage.getItem('iden');
    this.onLoad();
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        if (loc.path().startsWith("/portale")) {
          if (localStorage.getItem('iden') != null) {
            this.iden = localStorage.getItem('iden');
          }
        } else {
          this.iden = localStorage.getItem('iden');
        }
      }
    })
  }

  onLoad() {
    let url = window.location.href;
    let protocol = url.split("://");
    if (protocol[0].toLowerCase() != "https") {
      window.location.replace("https://" + protocol[1]);
    }
  }

}
