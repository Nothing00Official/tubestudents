import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';

import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import { NgxPayPalModule } from 'ngx-paypal';

import localeIt from '@angular/common/locales/it';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { DragDropDirective } from './dragdrop.directive';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UnloggedcontainerComponent } from './unloggedcontainer/unloggedcontainer.component';
import { CreatorComponent } from './creator/creator.component';
import { StudentComponent } from './student/student.component';
import { SupportComponent } from './support/support.component';
import { LoginComponent } from './login/login.component';
import { LoggedcontainerComponent } from './loggedcontainer/loggedcontainer.component';
import { PortalComponent } from './portal/portal.component';
import { AdminComponent, videoDialog, videoApproved, GuestUser, EditCategory } from './admin/admin.component';
import { CategoryComponent } from './category/category.component';
import { VideoComponent, VideoEdit } from './video/video.component';
import { CreatorpanelComponent } from './creatorpanel/creatorpanel.component';
import { IndexComponent } from './index/index.component';

registerLocaleData(localeIt, 'it');

@NgModule({
  declarations: [
    AppComponent,
    DragDropDirective,
    UnloggedcontainerComponent,
    CreatorComponent,
    StudentComponent,
    SupportComponent,
    LoginComponent,
    LoggedcontainerComponent,
    PortalComponent,
    AdminComponent,
    videoDialog,
    videoApproved,
    GuestUser,
    EditCategory,
    CategoryComponent,
    VideoComponent,
    VideoEdit,
    CreatorpanelComponent,
    IndexComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxPayPalModule,
    ReactiveFormsModule
  ],
  entryComponents: [videoDialog, videoApproved, GuestUser, EditCategory, VideoEdit],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'it-IT' }, { provide: LOCALE_ID, useValue: 'it' }, { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
