import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy{

  isLoading = false;
  private authStatusSub = new Subscription();
  constructor(private auth:AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.auth.getAuthStatusListner().subscribe(authStatus =>{
      if(!authStatus){
        this.isLoading = false;
      }else{
        this.isLoading = true;
      }
   })
  }

   onLogIn(form:NgForm){
    if(form.invalid){
      return
    }
    this.isLoading = true;
    this.auth.logInUser(form.value.email, form.value.password);

  }
ngOnDestroy(): void {
  this.authStatusSub.unsubscribe();
}
  }
