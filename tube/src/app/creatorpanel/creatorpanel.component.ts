import { Component, OnInit } from '@angular/core';
import { fadeOut } from '../animations';
import { HttpClient } from '@angular/common/http';
import { Video } from '../models/video.model';
import { SERVER_API_URL } from '../urls';
import { FormControl } from '@angular/forms';
import { GOOGLE_KEY } from '../constants';

@Component({
  selector: 'app-creatorpanel',
  templateUrl: './creatorpanel.component.html',
  styleUrls: ['./creatorpanel.component.css'],
  animations: fadeOut
})
export class CreatorpanelComponent implements OnInit {

  iden: string;
  error: string;
  loading: boolean = false;
  scanning: boolean = false;
  videos: Video[] = new Array();
  pendingvideos: Video[] = new Array();
  playlists: Object[] = new Array();

  videoControl = new FormControl("");

  constructor(public http: HttpClient) {
    this.iden = localStorage.getItem("iden");
    this.loadVideos();
  }

  ngOnInit(): void {
  }

  loadVideos(): void {
    this.loading = true;
    this.http.post<Video[]>(SERVER_API_URL, {
      request: "MYPENDINGVIDEO",
      session: true,
      id: this.iden
    }).subscribe(res => {
      this.videos = res;
      this.loading = false;
      this.loadChannel();
    });
  }

  loadChannel(): void {
    this.loading = true;
    this.http.post(SERVER_API_URL, {
      request: "CHANNELIDEN",
      session: true,
      iden: this.iden
    }).subscribe(res => {
      let iden = res["result"];
      this.loading = false;
      this.loadPlaylists(iden);
    });
  }

  delVideo(video) {
    this.pendingvideos.splice(this.pendingvideos.indexOf(video), 1);
  }

  loadPlaylists(id) {
    this.loading = true;
    this.http.get("https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&maxResults=1000&channelId=" + id + "&key=" + GOOGLE_KEY).subscribe(res => {
      if (res["items"] != null) {
        res["items"].forEach(el => {
          this.playlists.push({ id: el["id"], img: el["snippet"]["thumbnails"]["default"]["url"] })
        });
      }
      this.loading = false;
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
      let test = this.pendingvideos.filter(el => {
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
        this.pendingvideos.push(video);
        this.error = null;
        this.videoControl.setValue(null);
      }
      this.scanning = false;
      return;
    }
    let sp = id.split("&");
    id = sp[0];
    let res = this.pendingvideos.filter(el => {
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
        this.pendingvideos.push(video);
        this.error = null;
        this.videoControl.setValue(null);
      } else {
        this.error = "Nessun video trovato con questo url";
      }
      this.scanning = false;
    })
  }

  getbackgroundUrl(url) {
    return `url(${url})`;
  }

  send() {
    if (this.pendingvideos.length + this.videos.length > 10) {
      this.error = "Non puoi inviare più di 10 video o playlist alla volta!";
    }
    this.loading = true;
    this.error = "";
    this.sendVideo(0, this.iden);
  }
  sendVideo(index, id) {
    if (index == this.pendingvideos.length) {
      if (this.error == "") {
        this.error = null;
      }
      this.loading = false;
      this.pendingvideos = [];
      this.error = null;
      this.loadVideos();
      return;
    }
    this.http.post(SERVER_API_URL, {
      request: "ADDVIDEO",
      url: this.pendingvideos[index].url,
      author: id,
      imgUrl: this.pendingvideos[index].imgUrl
    }).subscribe(res => {
      if (res[0] == "KO") {
        this.error += "<br>" + res[1];
        this.loading = false;
      } else {
        index++;
        this.sendVideo(index, id);
      }
    });
  }

}
