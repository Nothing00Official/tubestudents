import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CreatorComponent } from './creator/creator.component';
import { StudentComponent } from './student/student.component';
import { SupportComponent } from './support/support.component';
import { LoginComponent } from './login/login.component';
import { PortalComponent } from './portal/portal.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
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
  PortalComponent
]
