import { Component, OnInit } from '@angular/core';
import { SessionManager } from '../session.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user.model';
import { fadeOut } from '../animations';
import { SERVER_API_URL } from '../urls';
import { Video } from '../models/video.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  animations: fadeOut
})
export class CategoryComponent implements OnInit {

  iden: string;
  loading: boolean = false;
  videos: Video[] = new Array();

  constructor(public session: SessionManager, public router: Router, public http: HttpClient, public route: ActivatedRoute) {
    this.iden = localStorage.getItem("iden");
    this.session.check().subscribe(res => {
      if (res[0] == "KO") {
        this.session.destroySession();
      }
    });
    let id = this.route.snapshot.paramMap.get('id');
    this.loadVideos(id);
  }

  loadVideos(id) {
    this.loading = true;
    this.http.post<Video[]>(SERVER_API_URL, {
      request: "VIDEOS",
      session: true,
      catid: id
    }).subscribe(res => {
      this.videos = res;
      this.loading = false;
    })
  }

  getBackgroundUrl(url) {
    return `url(${url})`;
  }

  ngOnInit(): void {
  }

}
