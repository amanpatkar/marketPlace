import { Injectable } from '@angular/core';
import { post } from './post.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts:post[] = [];
  private postUpdated = new Subject<post[]>();
  constructor() { }
  getPost(){
    return [...this.posts]
  }
  addPost(title:string, content:string){
    const post:post = {
      title:title, content:content
    };
    this.posts.push(post);
    this.postUpdated.next([...this.posts]);
  }
  getPostUpdateListner(){
    return this.postUpdated.asObservable();
  }
}
