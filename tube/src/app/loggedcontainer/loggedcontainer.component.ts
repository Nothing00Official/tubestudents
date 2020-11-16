import { Component, OnInit } from '@angular/core';
import { SessionManager } from '../session.service';

@Component({
  selector: 'app-loggedcontainer',
  templateUrl: './loggedcontainer.component.html',
  styleUrls: ['./loggedcontainer.component.css']
})
export class LoggedcontainerComponent implements OnInit {

  closed: boolean = false;

  constructor(public session: SessionManager) { }

  ngOnInit(): void {
  }

  goDonation(value) {
    window.open("https://www.unidea.org/it/donation/" + value, "_blank");
  }
}
