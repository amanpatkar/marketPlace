import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit , OnDestroy{

 constructor(private auth:AuthService){}
  isLoading = false;
  private authStatusSub = new Subscription();

  ngOnInit(): void {
    this.authStatusSub = this.auth.getAuthStatusListner().subscribe(authStatus =>{
      if(!authStatus){
        this.isLoading = false;
      }else{
        this.isLoading = true;
      }
   })
  }
  
  onSignUp(form:NgForm){
    this.isLoading = true;
    if(form.invalid){
      return;
    }
   console.log(form.value)
   this.auth.createUser(form.value.full_name,form.value.email,form.value.password);

 }
 ngOnDestroy(): void {
   this.authStatusSub.unsubscribe();
 }

}
