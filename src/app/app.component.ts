import { Component, OnInit } from '@angular/core';
import { post } from './posts/post.model';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'marketPlace';
  // storedPosts:post[] = [];
  // postAdded(post: any){
  // this.storedPosts.push(post)
  // }
   constructor(private auth:AuthService){

   }
  ngOnInit(): void {
    this.auth.autoAuthenticate();
  }
}
