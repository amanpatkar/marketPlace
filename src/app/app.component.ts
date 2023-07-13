import { Component } from '@angular/core';
import { post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'marketPlace';
  // storedPosts:post[] = [];
  // postAdded(post: any){
  // this.storedPosts.push(post)
  // }
}
