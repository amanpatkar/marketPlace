import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  isLoading = true;
  
  constructor(private auth:AuthService) {}

  ngOnInit(): void {
    this.isLoading = false;

  }

   onLogIn(form:NgForm){
    if(form.invalid){
      return
    }
    this.isLoading = true;
    this.auth.logInUser(form.value.email, form.value.password);

  }

  }
