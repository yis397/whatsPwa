import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ChatComponent } from './pages/chat/chat.component';

const routes: Routes = [
  {path:'auth',children:[
    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
  ]},
  {path:'chat',component:ChatComponent,canLoad:[AuthGuard],canActivate:[AuthGuard]},
  {path:'**',redirectTo:'chat'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
