import { Component, OnInit } from '@angular/core';
import { SessionManager } from '../session.service';

@Component({
  selector: 'app-loggedcontainer',
  templateUrl: './loggedcontainer.component.html',
  styleUrls: ['./loggedcontainer.component.css']
})
export class LoggedcontainerComponent implements OnInit {

  constructor(public session: SessionManager) { }

  ngOnInit(): void {
  }

}
