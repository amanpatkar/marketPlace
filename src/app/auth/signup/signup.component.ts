import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

 constructor(private auth:AuthService){}
  isLoading = true;


  ngOnInit(): void {
    this.isLoading = false;
  
  }
  
  onSignUp(form:NgForm){
   console.log(form.value)
   this.auth.createUser(form.value.email, form.value.password);

 }
}
