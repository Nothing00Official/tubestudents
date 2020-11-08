import { Component, OnInit } from '@angular/core';
import { SessionManager } from '../session.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { fadeOut } from '../animations';
import { SERVER_API_URL } from '../urls';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  animations: fadeOut
})
export class StudentComponent implements OnInit {

  iden: string;
  error: string;
  loading: boolean = false;
  done: boolean = false;

  mail = new FormControl("");

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

  goToRegister() {
    window.open("https://students.unidea.org", "_blank")
  }

  checkExists() {
    this.loading = true;
    this.http.get(SERVER_API_URL + "?request=USER_EXISTS&mail=" + this.mail.value).subscribe(res => {
      let bool = res["result"];
      if (bool == true) {
        this.error = "Hai già registrato questo account, se non ricordi la password contatta l'assistanza nell'apposita sezione nel menu in alto!"
        this.loading = false;
      } else {
        this.loadId();
      }
    });
  }

  loadId() {
    this.http.get(SERVER_API_URL + "?request=GET_STUDENT_ID&mail=" + this.mail.value).subscribe(res => {
      let id = res["result"];
      if (id == null) {
        this.error = "Questa mail non è ancora stata registrata alla piattaforma UNIDEA Students. Iscriviti alla piattaforma tramite il tasto 'Registrati' qui sopra!"
        this.loading = false;
      } else {
        this.saveStudent(id);
      }
    });
  }

  saveStudent(id) {
    this.http.post(SERVER_API_URL, {
      request: "ADDSTUDENT",
      mail: this.mail.value,
      studentID: id
    }).subscribe(res => {
      if (res[0] == "KO") {
        this.error = res[1];
      } else {
        this.error = null;
        this.done = true;
        this.mail.setValue("");
        setTimeout(() => {
          document.getElementById("success").scrollIntoView();
        }, 500);
      }
      this.loading = false;
    });
  }

  ngOnInit(): void {
  }

}
