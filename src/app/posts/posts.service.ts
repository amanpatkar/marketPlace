import { Injectable } from '@angular/core';
import { post } from './post.model';
import { Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts:post[] = [];
  private postUpdated = new Subject<post[]>();
  constructor(private http:HttpClient ) { }
  getPost(){
    this.http.get<{message:string, data:post, status:number}>('http://localhost:3000/api/posts')
    .pipe(map(postData =>{
      return postData.data['map']((post:any) =>{
        return {
          title:post.title,
          content:post.content,
          id:post._id
        }
      })
    }))
    .subscribe((transformPost:any)=>{
     this.posts = transformPost;
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

  // deletePosts(id:any){
  //  this.http.delete(`http://localhost:3000/api/posts/${id}`).subscribe(() =>{
  //     console.log("deleted!");
  //   })
  // }
  deletePosts(id: string): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.http.delete(`http://localhost:3000/api/posts/${id}`).subscribe(
        () => {
          this.getPost();
        },
        error => {
          console.log('Error deleting todo:', error);
        }
      );
    }
  }
  editPosts(id:string, data:post){
    if (confirm('Are you sure you want to update this post?')) {
      this.http.put(`http://localhost:3000/api/posts/${id}`, data).subscribe(
        () => {
          this.getPost();
        },
        error => {
          console.log('Error deleting todo:', error);
        }
      );
    }
  }
}
