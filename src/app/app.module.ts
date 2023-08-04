import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLinkActive } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatModule } from './mat/mat.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { PostListsComponent } from './posts/post-lists/post-lists.component';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ErrroInterceptor } from './error.interceptor';
import { ErrorComponent } from './error/error/error.component';


@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListsComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatModule,
    RouterLinkActive,
    HttpClientModule,
    BrowserAnimationsModule

  ],
  providers: [
   {provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor, multi:true},
   {provide:HTTP_INTERCEPTORS,useClass:ErrroInterceptor, multi:true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
