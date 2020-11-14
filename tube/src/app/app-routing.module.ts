import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CreatorComponent } from './creator/creator.component';
import { StudentComponent } from './student/student.component';
import { SupportComponent } from './support/support.component';
import { LoginComponent } from './login/login.component';
import { PortalComponent } from './portal/portal.component';
import { CategoryComponent } from './category/category.component';
import { VideoComponent } from './video/video.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'invia-video',
    component: CreatorComponent
  },
  {
    path: 'registrazione-studente',
    component: StudentComponent
  },
  {
    path: 'assistenza',
    component: SupportComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'portale',
    component: PortalComponent
  },
  {
    path: 'portale/c/:id',
    component: CategoryComponent
  },
  {
    path: 'portale/v/:id',
    component: VideoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  AppComponent,
  CreatorComponent,
  StudentComponent,
  SupportComponent,
  LoginComponent,
  PortalComponent,
  CategoryComponent,
  VideoComponent
]
