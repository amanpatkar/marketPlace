import { Component, Input, OnInit } from '@angular/core';
import { post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-lists',
  templateUrl: './post-lists.component.html',
  styleUrls: ['./post-lists.component.css']
})
export class PostListsComponent implements OnInit {
  // @Input() posts:post[] = [];
  posts:post[] = []
  constructor(public postService:PostsService){}
  private postSub: Subscription = new Subscription;
  ngOnInit(){
   this.postService.getPost();
   this.postService.getPostUpdateListner().subscribe((posts:post[])=>{
    this.posts = posts;
    console.log(this.posts)
   });
  }
  ngOnDestroy(){
    this.postSub.unsubscribe();
  }
  onDelete(id:any){
  
  this.postService.deletePosts(id)
 
  }
  onEdit(id:any){
    let post:post = {
      id: null,
      title: '',
      content: ''
    }
    this.postService.editPosts(id,post);

  }
}
