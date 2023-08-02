import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { user } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  isAuthenticated = false;
  private token:string | null | undefined = '';
  private tokenTimer:any;
  private userId:string | null = '';
  private authStatusListner = new Subject<boolean>();
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
  createUser(email:string, password:string){
  const authData:user = {
    email:email,
    password:password
  }
   this.http.post<user>("http://localhost:3000/api/user/signup",authData).subscribe(response =>{
    console.log(response)
   })
  }


  logInUser(email:string, password:string){
    const authData:user = {email:email,password:password}
    this.http.post<{token:string,expiresIn:number,userId:string}>('http://localhost:3000/api/user/login',authData).subscribe(response =>{
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
}
