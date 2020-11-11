import { Component, OnInit, Inject } from '@angular/core';
import { fadeOut } from '../animations';
import { Video } from '../models/video.model';
import { SessionManager } from '../session.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '../urls';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from '../models/category.model';
import { User } from '../models/user.model';

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
  error: string;
  user: User;

  constructor(private sanitizer: DomSanitizer, public session: SessionManager, public router: Router, public http: HttpClient, public route: ActivatedRoute, public dialog: MatDialog) {
    this.iden = localStorage.getItem("iden");
    this.session.check().subscribe(res => {
      if (res[0] == "KO") {
        this.session.destroySession();
      } else {
        this.session.loadUser().subscribe(res => {
          this.user = res;
          this.loading = false;
        })
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

  modifyVideo() {
    this.loading = true;
    this.http.post(SERVER_API_URL, {
      request: "EDITVIDEO",
      session: true,
      id: this.video.id,
      title: this.video.title,
      catid: this.video.categoryID
    }).subscribe(res => {
      if (res[0] == "KO") {
        this.error = res[1];
      }
      this.loading = false;
    })
  }

  removeVideo() {
    this.loading = true;
    this.http.post(SERVER_API_URL, {
      request: "DELVIDEO",
      session: true,
      id: this.video.id
    }).subscribe(res => {
      if (res[0] == "KO") {
        this.error = res[1];
      } else {
        this.router.navigate(['/portale']);
      }
      this.loading = false;
    })
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  editVideo(): void {
    const dialogRef = this.dialog.open(VideoEdit, {
      width: '300px',
      data: { video: this.video }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.modifyVideo();
      }
    });
  }

  delVideo(): void {
    const dialogRef = this.dialog.open(VideoEdit, {
      width: '300px',
      data: { video: this.video, delete: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.removeVideo();
      }
    });
  }

  ngOnInit(): void {
  }

}
@Component({
  selector: 'edit-video',
  templateUrl: 'edit-video.html',
  animations: fadeOut
})
export class VideoEdit {

  cats: Category[] = new Array();

  constructor(
    public dialogRef: MatDialogRef<VideoEdit>,
    @Inject(MAT_DIALOG_DATA) public data: Object, public http: HttpClient) {
    this.loadCategory();
  }

  loadCategory(): void {
    this.http.post<Category[]>(SERVER_API_URL, {
      request: "CATEGORIES",
      session: true
    }).subscribe(res => {
      this.cats = res;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
