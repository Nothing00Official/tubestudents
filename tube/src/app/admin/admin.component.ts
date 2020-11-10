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
import { User } from '../models/user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAIL_PATTERN } from '../constants';

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
  users: User[] = new Array();
  filteredUser: User[] = new Array();
  displayedColumnsChannel: string[] = ['id', 'name', 'mail', 'operation', 'delete'];
  displayedColumnsVideo: string[] = ['id', 'iden', 'channel', 'operation', 'delete'];
  displayedColumnsUser: string[] = ['id', 'username', 'type', 'recover', 'ban'];
  displayedColumnsCat: string[] = ['id', 'name', 'url', 'edit'];
  dataSourceChannel: MatTableDataSource<Channel>;
  dataSourceVideo: MatTableDataSource<Video>;
  dataSourceUser: MatTableDataSource<User>;
  dataSourceCat: MatTableDataSource<Category>;
  loading: boolean = false;
  error: string;
  success: string;

  @ViewChild('paginator1', { static: true }) paginator1: MatPaginator;
  @ViewChild('paginator2', { static: true }) paginator2: MatPaginator;
  @ViewChild('paginator3', { static: true }) paginator3: MatPaginator;
  @ViewChild('paginator4', { static: true }) paginator4: MatPaginator;

  constructor(public http: HttpClient, public dialog: MatDialog) {
    this.iden = localStorage.getItem("iden");
    this.loadCategory();
  }

  search(value) {
    if (value == "") {
      this.reloadDataSourceUser(this.users);
    }
    this.filteredUser = this.users.filter(el => {
      return el.username.toLowerCase().includes(value.toLowerCase());
    });
    this.reloadDataSourceUser(this.filteredUser);
  }

  reloadDataSourceChannel(channels: Channel[]): void {
    this.dataSourceChannel = new MatTableDataSource<Channel>(channels);
    this.dataSourceChannel.paginator = this.paginator1;
  }

  reloadDataSourceVideo(videos: Video[]): void {
    this.dataSourceVideo = new MatTableDataSource<Video>(videos);
    this.dataSourceVideo.paginator = this.paginator2;
  }

  reloadDataSourceUser(users: User[]): void {
    this.dataSourceUser = new MatTableDataSource<User>(users);
    this.dataSourceUser.paginator = this.paginator3;
  }

  reloadDataSourceCategory(categories: Category[]): void {
    this.dataSourceCat = new MatTableDataSource<Category>(categories);
    this.dataSourceCat.paginator = this.paginator4;
  }

  loadCategory(): void {
    this.loading = true;
    this.http.post<Category[]>(SERVER_API_URL, {
      request: "CATEGORIES",
      session: true
    }).subscribe(res => {
      this.categories = res;
      this.reloadDataSourceCategory(this.categories);
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

  sendRecover(user: User): void {
    this.loading = true;
    this.http.post(SERVER_API_URL, {
      request: "RECOVER",
      session: true,
      id: user.id
    }).subscribe(res => {
      if (res[0] == "KO") {
        this.error = res[1];
      } else {
        this.success = "Recupero inviato!";
        setTimeout(() => {
          this.success = null;
        }, 4000)
      }
      this.loading = false;
    });
  }

  ban(user: User, banned: boolean) {
    this.loading = true;
    this.http.post(SERVER_API_URL, {
      request: "BANUSER",
      session: true,
      id: user.id,
      banned: banned ? 0 : 1
    }).subscribe(res => {
      if (res[0] == "KO") {
        this.error = res[1];
        this.loading = false;
      } else {
        this.loadUsers();
      }
    });
  }

  onTabChanged(event) {
    if (event.index == 2) {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.loading = true;
    this.http.get<User[]>(SERVER_API_URL + "?request=USERS").subscribe(res => {
      this.users = res;
      this.reloadDataSourceUser(this.users);
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

  addGuest(user: User) {
    this.loading = true;
    this.http.post(SERVER_API_URL, {
      request: "ADDGUEST",
      session: true,
      mail: user.username,
      time: user.expireDate
    }).subscribe(res => {
      if (res[0] == "KO") {
        this.error = res[1];
      } else {
        this.loading = false;
        this.loadUsers();
      }

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

  openGuest(): void {
    const dialogRef = this.dialog.open(GuestUser, {
      width: '300px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.addGuest(result);
      }
    });
  }

  sendEditCat(cat: Category) {
    this.loading = true;
    this.http.post(SERVER_API_URL, {
      request: "EDITCATEGORY",
      session: true,
      id: cat.id,
      name: cat.name,
      color: cat.color,
      imgUrl: cat.imgUrl
    }).subscribe(res => {
      if (res[0] == "KO") {
        this.error = res[1];
      }
      this.loading = false;
    });
  }

  createCategory(cat: Category) {
    this.loading = true;
    this.http.post(SERVER_API_URL, {
      request: "ADDCATEGORY",
      session: true,
      name: cat.name,
      color: cat.color,
      imgUrl: cat.imgUrl
    }).subscribe(res => {
      if (res[0] == "KO") {
        this.error = res[1];
        this.loading = false;
      } else {
        this.loadCategory();
      }
    });
  }

  editCategory(cat: Category, edit: boolean): void {
    if (cat == null) {
      cat = new Category();
    }
    const dialogRef = this.dialog.open(EditCategory, {
      width: '300px',
      data: { cat: cat }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        if (edit) {
          this.sendEditCat(cat);
        } else {
          this.createCategory(cat);
        }
      }
    });
  }

}
@Component({
  selector: 'edit-category',
  templateUrl: 'edit-category.html',
  animations: fadeOut
})
export class EditCategory {

  form: FormGroup;
  error: string;

  constructor(
    public dialogRef: MatDialogRef<EditCategory>,
    @Inject(MAT_DIALOG_DATA) public data: Object, fb: FormBuilder, public http: HttpClient) {
    this.form = fb.group({
      name: ['', Validators.required],
      color: ['', Validators.required],
      url: ['', Validators.required]
    })
  }

  checkName() {
    let name = this.form.controls['name'].value;
    this.http.get(SERVER_API_URL + "?request=CATEGORY_EXISTS&name=" + name).subscribe(res => {
      if (res["result"] == true) {
        this.error = "Questa categoria è già registrata!";
        this.form.controls['name'].setErrors({ incorrect: true });
      } else {
        this.error = null;
        this.form.controls['name'].setErrors(null);
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'guest-dialog',
  templateUrl: 'guest-dialog.html',
  animations: fadeOut
})
export class GuestUser {

  user: User = new User();
  form: FormGroup;
  error: string;

  constructor(
    public dialogRef: MatDialogRef<GuestUser>,
    @Inject(MAT_DIALOG_DATA) public data: Object, fb: FormBuilder, public http: HttpClient) {
    this.form = fb.group({
      mail: ['', Validators.required],
      time: ['', Validators.required]
    })
  }

  checkMail() {
    let mail = this.form.controls['mail'].value;
    if (mail.search(MAIL_PATTERN) == -1) {
      this.form.controls['mail'].setErrors({ incorrect: true });
      this.error = "Inserire una mail valida!";
    } else {
      this.form.controls['mail'].setErrors(null);
      this.error = null;
      this.checkUser(mail);
    }
  }

  checkDate() {
    let time = this.form.controls['time'].value;
    let date = new Date(time);
    let now = new Date();
    if (date <= now) {
      this.form.controls['time'].setErrors({ incorrect: true });
      this.error = "La data di scadenza deve essere di almeno 1 giorno nel futuro";
    } else {
      this.form.controls['time'].setErrors(null);
      this.error = null;
    }
  }

  checkUser(user) {
    this.http.get(SERVER_API_URL + "?request=CORRECT_USER&user=" + user).subscribe(res => {
      if (res["result"] == true) {
        this.error = "Questo username è già registrato!";
        this.form.controls['mail'].setErrors({ incorrect: true });
      } else {
        this.error = null;
        this.form.controls['mail'].setErrors(null);
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
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
