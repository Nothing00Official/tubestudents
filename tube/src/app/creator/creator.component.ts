import { Component, OnInit } from '@angular/core';
import { fadeOut } from '../animations';
import { SessionManager } from '../session.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GOOGLE_KEY, MAIL_PATTERN, VALID_MAIL_DOMAINS } from '../constants';
import { SERVER_API_URL } from '../urls';
import { Video } from '../models/video.model';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.css'],
  animations: fadeOut
})
export class CreatorComponent implements OnInit {

  iden: string;
  loading: boolean = false;
  form: FormGroup;
  spinning: boolean = false;
  error: string;
  videos: Video[] = new Array();
  scanning: boolean = false;
  message: string;
  done: boolean = false;

  playlists: Object[] = new Array();

  videoControl = new FormControl();

  constructor(public session: SessionManager, public router: Router, fb: FormBuilder, public http: HttpClient) {
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
    this.form = fb.group({
      'iden': ['', Validators.required],
      'name': ['', Validators.required],
      'mail': ['', Validators.required]
    })
  }

  delVideo(video) {
    this.videos.splice(this.videos.indexOf(video), 1);
  }

  loadChannel(id) {
    this.http.get("https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=" + id + "&maxResults=1&key=" + GOOGLE_KEY).subscribe(res => {
      if (res["items"] != null) {
        let name = res["items"][0]["snippet"]["localized"]["title"];
        this.form.controls['name'].setValue(name);
        this.error = null;
        this.checkExistsMail(id, 'iden');
        this.loadPlaylists(id);
      } else {
        this.error = "Nessun canale trovato con questo id";
      }
      this.spinning = false;
    })
  }

  loadPlaylists(id) {
    this.http.get("https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&maxResults=1000&channelId=" + id + "&key=" + GOOGLE_KEY).subscribe(res => {
      if (res["items"] != null) {
        res["items"].forEach(el => {
          this.playlists.push({ id: el["id"], img: el["snippet"]["thumbnails"]["default"]["url"] })
        });
      }
    })
  }

  loadVideo() {
    this.scanning = true;
    let url = this.videoControl.value;
    let splitter = "?v=";
    if (url.includes("youtu.be")) {
      splitter = "youtu.be/";
    }
    if (url.includes("&list=")) {
      splitter = "&list=";
    }
    if (url.includes("?list=")) {
      splitter = "?list=";
    }
    let split = url.split(splitter);
    let id = split[1];
    if (url.includes("list=")) {
      let sp = id.split("&");
      id = sp[0];
      let test = this.videos.filter(el => {
        return el.url == "videoseries?list=" + id;
      });
      if (test.length > 0) {
        this.error = "hai già inserito questa playlist!";
        this.scanning = false;
        return;
      }
      let res = this.playlists.filter(el => {
        return el["id"] == id;
      });
      if (res.length == 0) {
        this.error = "Nessuna playlist trovata con questo url";
      } else {
        let video = new Video();
        video.imgUrl = res[0]["img"];
        video.url = "videoseries?list=" + res[0]["id"];
        this.videos.push(video);
        this.error = null;
        this.videoControl.setValue(null);
      }
      this.scanning = false;
      return;
    }
    let sp = id.split("&");
    id = sp[0];
    let res = this.videos.filter(el => {
      return el.url == id;
    });
    if (res.length > 0) {
      this.error = "hai già inserito questo video!";
      this.scanning = false;
      return;
    }
    this.http.get("https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=" + id + "&key=" + GOOGLE_KEY).subscribe(res => {
      if (res["items"] != null && res["items"].length > 0) {
        let img = res["items"][0]["snippet"]["thumbnails"]["default"]["url"];
        let video = new Video();
        video.imgUrl = img;
        video.url = id;
        this.videos.push(video);
        this.error = null;
        this.videoControl.setValue(null);
      } else {
        this.error = "Nessun video trovato con questo url";
      }
      this.scanning = false;
    })
  }

  timeout: any = null;

  onKeyChannel(event: any) {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(() => {
      this.spinning = true;
      $this.loadChannel(event.target.value);
    }, 500);
  }

  onKeyMail(event: any) {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(() => {
      let mail = event.target.value;
      let correct = false;
      if (mail.search(MAIL_PATTERN) != -1) {
        let domain = mail.split("@")[1];
        if (VALID_MAIL_DOMAINS.includes(domain.toLowerCase())) {
          correct = true;
        } else {
          this.error = "La casella mail inserita non è valida! Caselle consentite: GMail, Virgilio Mail, Yahoo, Alice.it, Microsoft Mail, Libero Mail";
        }
      } else {
        this.error = "Inserire una mail valida!";
      }
      if (!correct) {
        this.form.controls['mail'].setErrors({ 'incorrect': true });
      } else {
        this.checkExistsMail(mail, 'mail');
      }
    }, 500);
  }

  checkExistsMail(mail, type) {
    this.http.get(SERVER_API_URL + "?request=CHANNEL_EXISTS&mail=" + mail).subscribe(res => {
      if (res["result"] == true) {
        if (type == "mail") {
          this.error = "La mail inserita è già stata registrata!";
        } else {
          this.error = "Questo canale è già stato registrato!";
        }
        this.form.controls[type].setErrors({ 'incorrect': true });
      } else {
        this.form.controls[type].setErrors(null);
        this.error = null;
      }
    });
  }

  send() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.message = "Salvataggio informazioni canale in corso...";
    this.http.post(SERVER_API_URL, {
      request: "ADDCHANNEL",
      iden: this.form.controls['iden'].value,
      name: this.form.controls['name'].value,
      mail: this.form.controls['mail'].value,
    }).subscribe(res => {
      if (res[0] == "KO") {
        this.loading = false;
        this.error = res[1];
      } else {
        this.error = "";
        this.sendVideo(0, res[1]);
      }
    });
  }

  sendVideo(index, id) {
    if (index == this.videos.length) {
      if (this.error == "") {
        this.error = null;
      }
      this.done = true;
      this.loading = false;
      return;
    }
    this.message = "Salvataggio video " + this.videos[index].url + " in corso...";
    this.http.post(SERVER_API_URL, {
      request: "ADDVIDEO",
      url: this.videos[index].url,
      author: id,
      imgUrl: this.videos[index].imgUrl
    }).subscribe(res => {
      if (res[0] == "KO") {
        this.error += "<br>" + res[1];
      } else {
        index++;
        this.sendVideo(index, id);
      }
    });
  }

  getbackgroundUrl(url) {
    return `url(${url})`;
  }

  ngOnInit(): void {
  }

}
