import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit , OnDestroy{


  constructor(private auth:AuthService) {}
  private authSubscription = new Subscription();

  isUserAuthenticated = false;
  ngOnInit(): void {
    this.isUserAuthenticated = this.auth.getAuthStatus();
   this.authSubscription = this.auth.getAuthStatusListner().subscribe(isAuthenticated =>{
    this.isUserAuthenticated = isAuthenticated;
   }); 
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  onLogOut(){
    this.auth.logOut();
  }
}
