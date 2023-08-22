import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createUser, user } from './auth.model';
import { Subject, map } from 'rxjs';
import { Router } from '@angular/router';
import {environement} from '../../environments/environment'

const BACK_END_URL =environement.apiUrl + '/user/users'
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  isAuthenticated = false;
  private token:string | null | undefined = '';
  private tokenTimer:any;
  private userId:string | null = '';
  private authStatusListner = new Subject<boolean>();
  loginUser = new Subject<any>();
  constructor(private http:HttpClient,private router:Router) { }

  getToken(){
    return this.token
  }

  getAuthStatus(){
    return this.isAuthenticated;
  }
  getAuthStatusListner(){
    return this.authStatusListner.asObservable();
  }
  createUser(full_name:string,email:string, password:string){
  const authData:createUser = {
    full_name:full_name,
    email:email,
    password:password
  }
 this.http.post<user>(environement.apiUrl+"/user/signup",authData).subscribe(response =>{
    this.authStatusListner.next(true);
    this.router.navigate(['/'])
   },error =>{
    this.authStatusListner.next(false);
   })
  }


  logInUser(email:string, password:string){
    const authData:user = {email:email,password:password}
    this.http.post<{token:string,expiresIn:number,userId:string}>(environement.apiUrl+'/user/login',authData).subscribe(response =>{
      console.log(response)
      const token = response.token;
      this.token = token;
      if(token){
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true; 
        this.userId = response.userId;
        this.authStatusListner.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token,expirationDate,this.userId)
        this.router.navigate(['/']);
      }
     },error =>{
      this.authStatusListner.next(false);
     })
  }
 getUserId(){
  return this.userId
 }

  private setAuthTimer(duration:number){
    console.log("timer", duration)
    this.tokenTimer= setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }
  logOut(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null
    this.router.navigate(['/']);
  }

  private saveAuthData(token:string, expirationDate:Date, userId:string){
    localStorage.setItem("token",token);
    localStorage.setItem("expiration",expirationDate.toISOString());
    localStorage.setItem("userId", String(this.userId))
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  autoAuthenticate(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation?.expirationTime.getTime();
    const time = Number(expiresIn) - now.getTime();
    if(time > 0){
      this.token = authInformation?.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId
       this.setAuthTimer(time/1000);
      this.authStatusListner.next(true);
    }
  }
  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationTime = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if(!token || !expirationTime){
      return;
    }
    return {token:token,expirationTime: new Date(expirationTime), userId:userId}
  }

  users = []
  getUser(){
    this.http.get<{message:string, data:user, status:number,maxPost:number}>(BACK_END_URL)
    .subscribe((transformPost:any)=>{
     this.users = transformPost.posts;
     console.log(this.users)
    })
   
  }

  getPostData(id:string){
    return this.http.get<{_id:string,email:string,full_name:string}>(BACK_END_URL+'/'+id);
    }
}
