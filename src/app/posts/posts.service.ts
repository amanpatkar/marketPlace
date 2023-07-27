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
          imagePath:post.imagePath,
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
  return this.http.get<{_id:string,title:string,content:string,imagePath:string}>('http://localhost:3000/api/posts/'+id);
  }
  addPost(title:string, content:string, image:File){
    const postData = new FormData();
    postData.append("title",title);
    postData.append("content",content);
    postData.append("image",image);
  
    this.http.post<{message:string,post:post}>('http://localhost:3000/api/posts', postData).subscribe((resData:any) =>{
    const post:post = {
      id: resData.post.id,
      title: resData.title,
      content: resData.content,
      imagePath: resData.imagePath
    } 
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
  editPosts(id:string, title:string, content:string, image:string){
    const post:post = {
      id:id,
      title:title,
      content:content,
      imagePath: image
    }
    if (confirm('Are you sure you want to update this post?')) {
      const PostData =  new FormData();
      PostData.append("id",id);
      PostData.append("title",title);
      PostData.append("content",content);
      PostData.append("image",image);
      this.http.put(`http://localhost:3000/api/posts/${id}`, PostData).subscribe(
        (response) => {
          console.log(response,"Edit")
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
