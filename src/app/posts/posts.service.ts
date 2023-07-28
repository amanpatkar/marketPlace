import { Injectable } from '@angular/core';
import { post } from './post.model';
import { Observable, Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
   posts:post[] = [];
   postUpdated = new Subject<{posts:post[], postCount: number}>();
  constructor(private http:HttpClient , private router:Router) { }
  getPost(postsPerPage:number, currentPage:number){
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`
    this.http.get<{message:string, data:post, status:number,maxPost:number}>('http://localhost:3000/api/posts'+queryParams)
    .pipe(map(postData =>{
      return { posts: postData.data['map']((post:any) =>{
        return {
          title:post.title,
          content:post.content,
          imagePath:post.imagePath,
          id:post._id
        }
      }), maxPosts:postData.maxPost
    }
    }))
    .subscribe((transformPost:any)=>{
     this.posts = transformPost.posts;
     this.postUpdated.next({posts:[...this.posts], postCount:transformPost.maxPosts})
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
    // const post:post = {
    //   id: resData.post.id,
    //   title: resData.title,
    //   content: resData.content,
    //   imagePath: resData.imagePath
    // } 
    //   this.posts.push(post);
    //   this.postUpdated.next([...this.posts]); 
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
  deletePosts(id: string) {
    return this.http.delete(`http://localhost:3000/api/posts/${id}`)
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
        // const updatePosts = [...this.posts];
        // const oldPostIndex = updatePosts.findIndex((p => p.id === post.id));
        // updatePosts[oldPostIndex] = post;
        // this.posts = updatePosts;
        // this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
        
        },
        error => {
          console.log('Error deleting todo:', error);
        }
      );
    }
  }
}
