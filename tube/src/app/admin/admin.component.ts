import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Channel } from '../models/channel.model';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SERVER_API_URL } from '../urls';
import { fadeOut } from '../animations';
import { Video } from '../models/video.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  animations: fadeOut
})
export class AdminComponent implements OnInit {

  iden: string;
  channels: Channel[] = new Array();
  videos: Video[] = new Array();
  categories: Category[] = new Array();
  displayedColumnsChannel: string[] = ['id', 'name', 'mail', 'operation', 'delete'];
  displayedColumnsVideo: string[] = ['id', 'iden', 'channel', 'operation', 'delete'];
  dataSourceChannel: MatTableDataSource<Channel>;
  dataSourceVideo: MatTableDataSource<Video>;
  loading: boolean = false;
  error: string;

  @ViewChild('paginator1', { static: true }) paginator1: MatPaginator;
  @ViewChild('paginator2', { static: true }) paginator2: MatPaginator;

  constructor(public http: HttpClient, public dialog: MatDialog) {
    this.iden = localStorage.getItem("iden");
    this.loadCategory();
  }

  reloadDataSourceChannel(channels: Channel[]): void {
    this.dataSourceChannel = new MatTableDataSource<Channel>(channels);
    this.dataSourceChannel.paginator = this.paginator1;
  }

  reloadDataSourceVideo(videos: Video[]): void {
    this.dataSourceVideo = new MatTableDataSource<Video>(videos);
    this.dataSourceVideo.paginator = this.paginator2;
  }

  loadCategory(): void {
    this.loading = true;
    this.http.post<Category[]>(SERVER_API_URL, {
      request: "CATEGORIES",
      session: true
    }).subscribe(res => {
      this.categories = res;
      this.loading = false;
      this.loadChannels();
    });
  }

  loadChannels(): void {
    this.loading = true;
    this.http.post<Channel[]>(SERVER_API_URL, {
      request: "CHANNELS",
      session: true
    }).subscribe(res => {
      this.channels = res;
      this.reloadDataSourceChannel(this.channels);
      this.loading = false;
      this.loadVideos();
    });
  }

  loadVideos(): void {
    this.loading = true;
    this.http.post<Video[]>(SERVER_API_URL, {
      request: "NOT_APPROVED_VIDEOS",
      session: true
    }).subscribe(res => {
      this.videos = res;
      this.reloadDataSourceVideo(this.videos);
      this.loading = false;
    });
  }

  approveChannel(channel: Channel) {
    this.loading = true;
    this.http.post(SERVER_API_URL, {
      request: "APPROVECHANNEL",
      session: true,
      id: channel.userID,
      iden: channel.iden
    }).subscribe(res => {
      if (res[0] == "KO") {
        this.error = res[1];
      } else {
        this.channels.splice(this.channels.indexOf(channel), 1);
        this.error = null;
        this.loadVideos();
      }
      this.loading = false;
    });
  }

  approveVideo(video: Video) {
    this.loading = true;
    this.http.post(SERVER_API_URL, {
      request: "APPROVEVIDEO",
      session: true,
      id: video.id,
      imgUrl: video.imgUrl,
      catid: video.categoryID,
      title: video.title
    }).subscribe(res => {
      if (res[0] == "KO") {
        this.error = res[1];
        this.loading = false;
      } else {
        this.error = null;
        this.loadVideos();
      }
    });
  }

  deleteVideo(video: Video) {
    this.loading = true;
    this.http.post(SERVER_API_URL, {
      request: "DELVIDEO",
      session: true,
      id: video.id
    }).subscribe(res => {
      if (res[0] == "KO") {
        this.error = res[1];
      } else {
        this.error = null;
        this.videos.splice(this.videos.indexOf(video), 1);
      }
      this.loading = false;
    });
  }

  deleteChannel(channel: Channel) {
    this.loading = true;
    this.http.post(SERVER_API_URL, {
      request: "DELCHANNEL",
      session: true,
      iden: channel.iden
    }).subscribe(res => {
      if (res[0] == "KO") {
        this.error = res[1];
      } else {
        this.error = null;
        this.channels.splice(this.channels.indexOf(channel), 1);
      }
      this.loading = false;
    });
  }

  visitChannel(iden) {
    window.open("https://www.youtube.com/channel/" + iden, "_blank")
  }

  ngOnInit(): void {
  }

  viewVideo(video: Video): void {
    const dialogRef = this.dialog.open(videoDialog, {
      width: '60%',
      data: { video: video.url }
    });
  }

  confirmVideo(video: Video): void {
    const dialogRef = this.dialog.open(videoApproved, {
      width: '300px',
      data: { video: video, cats: this.categories }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.approveVideo(video);
      }
    });
  }

}
@Component({
  selector: 'video-dialog',
  templateUrl: 'video-dialog.html'
})
export class videoApproved {
  constructor(
    public dialogRef: MatDialogRef<videoApproved>,
    @Inject(MAT_DIALOG_DATA) public data: Object) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'video-panel',
  templateUrl: 'video-panel.html'
})
export class videoDialog {
  url: SafeResourceUrl = null;
  constructor(
    public dialogRef: MatDialogRef<videoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Object, private sanitizer: DomSanitizer) {
    this.url = this.transform("https://www.youtube.com/embed/" + this.data["video"]);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
