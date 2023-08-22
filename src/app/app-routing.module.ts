import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListsComponent } from './posts/post-lists/post-lists.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { MultiFormComponent } from './auth/multi-form/multi-form.component';

const routes: Routes = [
  {
    path:'', component:PostListsComponent
  },
  {
    path:'create', component:PostCreateComponent , canActivate:[AuthGuard]
  },
  {
    path:"edit/:postId", component:PostCreateComponent, canActivate:[AuthGuard]
  },
  {
    path:'login', component:LoginComponent
  },
  {
    path:'signup', component:SignupComponent
  },
  {
    path:'form', component:MultiFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
