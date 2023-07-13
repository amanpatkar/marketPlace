import { Injectable } from '@angular/core';
import { post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts:post[] = [];
  private postUpdated = new Subject<post[]>();
  constructor(private http:HttpClient ) { }
  getPost(){
    this.http.get<{message:string, data:post, status:number}>('http://localhost:3000/api/posts').subscribe((postsData:any)=>{
     this.posts = postsData.data;
     this.postUpdated.next([...this.posts])
    })
   
  }
  addPost(title:string, content:string){
    const post:post = {
     id:null, title:title, content:content
    };
    this.http.post<{message:string}>('http://localhost:3000/api/posts', post).subscribe((resData:any) =>{
      console.log(resData.message);
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
    });
  }
  getPostUpdateListner(){
    return this.postUpdated.asObservable();
  }
}
