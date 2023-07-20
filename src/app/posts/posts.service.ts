import { Injectable } from '@angular/core';
import { post } from './post.model';
import { Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
   posts:post[] = [];
   postUpdated = new Subject<post[]>();
  constructor(private http:HttpClient , private router:Router) { }
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
  getPostData(id:string){
  return this.http.get<{_id:string,title:string,content:string}>('http://localhost:3000/api/posts/'+id);
  }
  addPost(title:string, content:string){
    const post:post = {
     id:null, title:title, content:content
    };
    this.http.post<{message:string,postId:string}>('http://localhost:3000/api/posts', post).subscribe((resData:any) =>{
      const id = resData.id;
      post.id = id;
      this.posts.push(post);
      this.postUpdated.next([...this.posts]); 
      this.router.navigate(['/'])
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
          // this.getPost();
          const updatedPost = this.posts.filter(post => post.id !== id)
          this.posts = updatedPost;
          this.postUpdated.next([...this.posts]);
        },
        error => {
          console.log('Error deleting todo:', error);
        }
      );
    }
  }
  editPosts(id:string, title:string, content:string){
    const post:post = {
      id:id,
      title:title,
      content:content
    }
    if (confirm('Are you sure you want to update this post?')) {
      this.http.put(`http://localhost:3000/api/posts/${id}`, post).subscribe(
        () => {
        const updatePosts = [...this.posts];
        const oldPostIndex = updatePosts.findIndex((p => p.id === post.id));
        updatePosts[oldPostIndex] = post;
        this.posts = updatePosts;
        this.postUpdated.next([...this.posts]);
        
        },
        error => {
          console.log('Error deleting todo:', error);
        }
      );
    }
  }
}
