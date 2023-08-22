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
  userId:any
  // storedPosts:post[] = [];
  // postAdded(post: any){
  // this.storedPosts.push(post)
  // }
   constructor(private auth:AuthService){

   }
  ngOnInit(): void {
    this.auth.autoAuthenticate();
    this.userId = String(this.auth.getUserId());
    this.auth.getPostData(this.userId).subscribe((res:any)=>{
      this.auth.loginUser.next(res.full_name);
    })
  }
}
