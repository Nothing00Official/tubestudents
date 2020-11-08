import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CreatorComponent } from './creator/creator.component';
import { StudentComponent } from './student/student.component';
import { SupportComponent } from './support/support.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
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
  LoginComponent
]
