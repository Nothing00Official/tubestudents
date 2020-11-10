import { Component, OnInit } from '@angular/core';
import { fadeOut } from '../animations';
import { Video } from '../models/video.model';
import { SessionManager } from '../session.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '../urls';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
  animations: fadeOut
})
export class VideoComponent implements OnInit {

  iden: string;
  loading: boolean = false;
  video: Video;
  url: SafeResourceUrl = null;

  constructor(private sanitizer: DomSanitizer, public session: SessionManager, public router: Router, public http: HttpClient, public route: ActivatedRoute) {
    this.iden = localStorage.getItem("iden");
    this.session.check().subscribe(res => {
      if (res[0] == "KO") {
        this.session.destroySession();
      }
    });
    let id = this.route.snapshot.paramMap.get('id');
    this.loadVideo(id);
  }

  loadVideo(id) {
    this.loading = true;
    this.http.post<Video>(SERVER_API_URL, {
      request: "VIDEO_MODEL",
      session: true,
      id: id
    }).subscribe(res => {
      this.video = res;
      this.url = "https://www.youtube.com/embed/" + this.video.url;
      this.loading = false;
    })
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit(): void {
  }

}
